FROM docker.elastic.co/logstash/logstash:8.14.3

RUN rm -f /usr/share/logstash/pipeline/logstash.conf

COPY config/ /usr/share/logstash/config/

CMD ["logstash", "-f", "/usr/share/logstash/config/logstash.conf"]


