# Data Insight Tass Fly

Addressed a healthcare company’s data infrastructure challenges that are hard to manage data transformation for variety of hospital’s data sources.
 
Provided A data transformation Framework that provides schema matching with simple API and rule engine that defines rules and conditions with simple user Interface.

Built A data pipeline framework for realtime ETL

[Demo Slide](http://www.williamjin.com)   

## Healthcare company current data infrastructure

![Alt text](/img/cur_data_pipeline.png?raw=true)

Hospitals send their records every day to the company’s cloud, and then software engineers run script to clean those data and load to database for data scientists use. This process is controlled manually, and the data is processed once a day. 
With more and more hospitals became their clients. This system requires more and more human efforts to achieve data transformation, and also affect that data scientists analyze the data in time.  

![Alt text](/img/attributes.png?raw=true)

## Data Pipeline

![Alt text](/img/my_data_pipeline.png?raw=true)

### 1. Kinesis  
Kinesis ingests all incoming records based on different subscriptions (hospitals).

#### Configuration: 

- 2 weeks retention period for backup
- 5 shards
- 1000 events per shards

### 2. FireHose and Lambda
Firehose does route records to different destination and also collaborate with Lambda to help data transformation. Incoming records from Kinesis will reside in buffer first, then FireHose trigger Lambda function to do micro batch processing to do schema and case validation. After Lambda function finishes, FireHose will send clean data to S3 and invoke RedShift to run COPY command to load clean data from S3 to RedShift.

#### Configuration:

- 1 MB buffer or 60 seconds threshold in order to trigger Lambda
- Retry 3 times if Lambda fails
- save records as JSON format to S3
- order data as time-stamp in S3

### 3. DynamoDB
As key sorted-key value database, it provides high performance for schema dictionary matching, record joins, and metadata lookup. A hospital can create a table in DynamoDB and define customized partition key and sort key. Also provide up to 10 indexing tables for other use case queries in high speed. 

#### Configuration:
- auto-scalling up to 100000 read/write units
- 2 index tables for hospitals
- consistent read query. 

## MicroBatch Processing
![Alt text](/img/real-time-graph.png?raw=true)


