import os
import json
import subprocess
import requests
from github import Github

class AIClient:
    def __init__(self):
        self.provider = os.getenv('AI_PROVIDER', 'deepseek').lower()
        self.api_keys = {
            'deepseek': os.getenv('DEEPSEEK_API_KEY'),
            'openai': os.getenv('OPENAI_API_KEY')
        }
        self.endpoints = {
            'deepseek': 'https://api.deepseek.com/v1/chat/completions',
            'openai': 'https://api.openai.com/v1/chat/completions'
        }
        self.models = {
            'deepseek': 'deepseek-coder',
            'openai': 'gpt-4o'
        }

    def analyze_code(self, diff):
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_keys[self.provider]}'
        }

        prompt = self._create_prompt(diff)
        
        payload = {
            "model": self.models[self.provider],
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.1,
            "max_tokens": 3000
        }

        try:
            response = requests.post(
                self.endpoints[self.provider],
                headers=headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            return self._parse_response(response.json())
        
        except requests.exceptions.RequestException as e:
            if self.provider == 'deepseek':
                print("DeepSeek failed, falling back to OpenAI")
                self.provider = 'openai'
                return self.analyze_code(diff)
            raise RuntimeError(f"AI API failed: {str(e)}")

    def _create_prompt(self, diff):
        return f"""As a senior code reviewer, analyze this code diff. Check for:
- Code quality issues
- Potential bugs
- Security vulnerabilities
- Missing test coverage
- Style inconsistencies
- Performance improvements
- Adherence to best practices

For test coverage:
1. Identify untested complex logic
2. Verify new public methods/APIs have tests
3. Check for missing edge case coverage
4. Suggest specific test scenarios with code examples

Format response as JSON with:
{{
  "accepted": boolean,
  "comments": [
    {{
      "file": "filename", 
      "line": number,
      "comment": "Markdown feedback",
      "test_suggestion": "optional test code"
    }}
  ]
}}

Diff:
{diff}
"""

    def _parse_response(self, response):
        content = response['choices'][0]['message']['content']
        return json.loads(content.strip('`').replace('json\n', ''))

def post_comments(comments, pr):
    """Post review comments with test suggestions"""
    repo = pr.base.repo
    for comment in comments:
        try:
            file_content = repo.get_contents(comment['file'], ref=pr.head.sha).decoded_content
            total_lines = len(file_content.decode().split('\n'))
            
            if 1 <= comment['line'] <= total_lines:
                body = comment['comment']
                if comment.get('test_suggestion'):
                    lang = comment.get('language', 'python')
                    body += f"\n\n**Test Suggestion:**\n```{lang}\n{comment['test_suggestion']}\n```"
                
                pr.create_review_comment(
                    body=body,
                    commit=pr.head.sha,
                    path=comment['file'],
                    line=comment['line']
                )
        except Github.GithubException.GithubException as e:
            print(f"Failed to post comment: {comment} {str(e)} {e.status} {e.data} {e.headers}")

def main():
    ai_client = AIClient()
    
    try:
        with open(os.environ['GITHUB_EVENT_PATH']) as f:
            event = json.load(f)
        
        g = Github(os.environ['GITHUB_TOKEN'])
        repo = g.get_repo(os.environ['GITHUB_REPOSITORY'])
        pr = repo.get_pull(event['number'])

        diff = subprocess.check_output(
            ['git', 'diff', '--unified=0', pr.base.sha, pr.head.sha, ':(exclude)package-lock.json']
        ).decode('utf-8')

        feedback = ai_client.analyze_code(diff)

        if feedback.get('comments'):
            post_comments(feedback['comments'], pr)

        if feedback.get('accepted', False):
            pr.create_review(
                event="APPROVE",
                body="✅ AI Code Review: Changes approved"
            )
        else:
            pr.create_review(
                event="REQUEST_CHANGES",
                body="❌ AI Code Review: Requires changes\n\n" +
                     "Address the comments above before merging"
            )
    
    except Exception as e:
        error_msg = f"🚨 Code review failed: {str(e)}"
        if 'pr' in locals():
            pr.create_issue_comment(error_msg)
        print(error_msg)
        raise

if __name__ == "__main__":
    main()