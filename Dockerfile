FROM ubuntu

ENV LANGUAGE="en_US.UTF-8" \
  LC_ALL="C.UTF-8" \
  LANG="en_US.UTF-8"

ENV TINI_VERSION v0.16.1
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

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

COPY ./Gemfile ./Gemfile.lock ./
RUN bundle install

COPY ./ ./

ENTRYPOINT ["/tini", "--", "bundle", "exec"]
CMD ["jekyll", "serve"]