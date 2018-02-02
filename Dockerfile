FROM ubuntu

ENV LC_ALL="C.UTF-8" \
  LANG="en_US.UTF-8" \
  LANGUAGE="en_US.UTF-8"

RUN apt-get update && \
  apt-get install --assume-yes \
    build-essential \
    git \
    ruby-dev \
    zlib1g-dev && \
  rm -rf /var/lib/apt/lists/*

RUN gem install bundler

RUN mkdir -p /usr/share/jekyll
WORKDIR /usr/share/jekyll
VOLUME ["/usr/share/jekyll"]

COPY ./Gemfile .
RUN bundle install --quiet

COPY . .

ENV TINI_VERSION v0.16.1
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--", "bundle", "exec"]
CMD ["jekyll", "serve"]