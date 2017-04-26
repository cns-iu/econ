var metric_descriptions = {
  "records": {
    "schema": 
    [
      {
        "name": "metric_id",
        "type": "numeric"
      },
      {
        "name": "metric_name",
        "type": "string"
      },
      {
        "name": "metric_desc",
        "type": "string"
      },
      {
        "name": "display",
        "type": "string"
      }
    ],
    "data": 
    [
      {
        "display": false,
        "metric_desc": "The number of unique top concepts that an article uses within 5 years of the concept's vintage.",
        "metric_id": 2,
        "metric_name": "Number of New Concepts"
      },
      {
        "display": true,
        "metric_desc": "Average difference in age between an article and the articles that it cites.",
        "metric_id": 3,
        "metric_name": "Average Age of References"
      },
      {
        "display": false,
        "metric_desc": "Number of citations of an article within articles indexed in MEDLINE up until 2014.",
        "metric_id": 4,
        "metric_name": "Number of Citations"
      },
      {
        "display": true,
        "metric_desc": "Herfindahl index of an article based on the field of forward citation articles.",
        "metric_id": 5,
        "metric_name": "Disciplinarity Diversity of Citations"
      },
      {
        "display": true,
        "metric_desc": "The mean 5-year forward dispersion across fields of top concepts that an article uses.",
        "metric_id": 1,
        "metric_name": "Diversity of Concepts"
      }
    ]
  }
}