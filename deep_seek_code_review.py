import os
import json
import subprocess
import requests
from github import Github

def get_diff(base_sha, head_sha):
    """Get unified diff between base and head commits"""
    diff = subprocess.check_output(
        ['git', 'diff', '--unified=0', base_sha, head_sha]
    ).decode('utf-8')
    return diff

def analyze_with_deepseek(diff, api_key):
    """Send diff to DeepSeek for analysis with test checking"""
    prompt = f"""As a senior code reviewer, analyze this code diff. Check for:
- Code quality issues
- Potential bugs
- Security vulnerabilities
- Style inconsistencies
- Performance improvements
- Adherence to best practices
- Missing test cases for new/changed functionality

For each potential test deficiency:
1. Identify untested complex logic
2. Note new public methods/APIs without tests
3. Check for edge cases not covered
4. Suggest specific test scenarios including:
   - Happy path tests
   - Edge cases
   - Error conditions
   - Input validation
   - Performance benchmarks where applicable

Format response as JSON with:
{{
  "accepted": boolean,
  "comments": [
    {{
      "file": "filename", 
      "line": number,
      "comment": "Markdown-formatted feedback with code suggestions",
      "test_suggestion": "Optional test code example"
    }}
  ]
}}

Diff:
{diff}
"""

    response = requests.post(
        'https://api.deepseek.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {api_key}'},
        json={
            "model": "deepseek-coder",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.1,
            "max_tokens": 3000  # Increased for test examples
        }
    )
    return response.json()['choices'][0]['message']['content']

def post_comments(comments, pr):
    """Post review comments with test suggestions"""
    repo = pr.base.repo
    for comment in comments:
        file_content = repo.get_contents(comment['file'], ref=pr.head.sha).decoded_content
        total_lines = len(file_content.decode().split('\n'))
        
        if 1 <= comment['line'] <= total_lines:
            body = comment['comment']
            if 'test_suggestion' in comment:
                body += f"\n\n**Test Suggestion:**\n```{comment.get('language', 'python')}\n"
                body += f"{comment['test_suggestion']}\n```"
            
            pr.create_review_comment(
                body=body,
                commit=pr.head.sha,
                path=comment['file'],
                line=comment['line']
            )

def main():
    # Load GitHub event data
    with open(os.environ['GITHUB_EVENT_PATH']) as f:
        event = json.load(f)
    
    # Initialize GitHub API
    g = Github(os.environ['GITHUB_TOKEN'])
    repo = g.get_repo(os.environ['GITHUB_REPOSITORY'])
    pr = repo.get_pull(event['number'])

    # Get SHAs for comparison
    base_sha = pr.base.sha
    head_sha = pr.head.sha

    # Get code diff
    diff = get_diff(base_sha, head_sha)
    
    # Get DeepSeek analysis
    analysis = analyze_with_deepseek(diff, os.environ['DEEPSEEK_API_KEY'])
    
    try:
        feedback = json.loads(analysis.strip('`').replace('json\n', ''))
    except json.JSONDecodeError:
        pr.create_issue_comment("⚠️ Error parsing DeepSeek response")
        return

    # Post review comments
    if feedback.get('comments'):
        post_comments(feedback['comments'], pr)

    # Set final review status
    if feedback.get('accepted', False):
        pr.create_review(
            event="APPROVE",
            body="✅ DeepSeek Code Review: Changes look good!"
        )
    else:
        pr.create_review(
            event="REQUEST_CHANGES",
            body="❌ DeepSeek Code Review: Required changes before merging"
        )

if __name__ == "__main__":
    main()