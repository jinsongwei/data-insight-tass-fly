# Data Insight Tass Fly

Addressed a healthcare company’s data infrastructure challenges that are hard to manage data transformation for variety of hospital’s data sources.
 
Provided A data transformation Framework that provides schema matching with simple API and rule engine that defines rules and conditions with simple user Interface.

Built A data pipeline framework for realtime ETL

[Demo Slide](http://www.williamjin.com)   

## Healthcare company current Data Structure


## Healthcare company current Data Structure
### 1. Kafka  
Kafka as the message broker. Deployed on the Kafka system on AWS cluster with 3 ec2 instances.  

### 2. Spark Streaming
Spark Streaming to do the micro-batch jobs. Calculate the trending of products for customers with different ages and in different locations. The window size is adjustable.  

### 3. Cassandra
Cassandra as the database to store the recommendation list and results from spark streaming.

## Batch Processing 
### 1. HDFS
HDFS to store the data from Kafka. Every 20Mb, the Kafka consumer will save the file to HDFS to ensure data persistence.
### 2. Hadoop MapReduce
Implemented 5 mapreduce jobs in chain to calculate the recommendation list by using the item based collaborative filtering.

## Data Pipeline
Reference-style: 
![alt text][logo]

[logo]: https://github.com/zkz917/Sale_analysis_Recommendation_Insight/blob/master/image/data.png

### MapReduce Job
cd src

hdfs dfs -rm -r /dataDividedByUser

hdfs dfs -rm -r /coOccurrenceMatrix

hdfs dfs -rm -r /Normalize

hdfs dfs -rm -r /Multiplication

hdfs dfs -rm -r /Sum

cd src/main/java/

hadoop com.sun.tools.javac.Main *.java

jar cf recommender.jar *.class

hadoop jar recommender.jar Driver /input /dataDividedByUser /coOccurrenceMatrix /Normalize /Multiplication /Sum

hdfs dfs -cat /Sum/*

#args0: original dataset

#args1: output directory for DividerByUser job

#args2: output directory for coOccurrenceMatrixBuilder job

#args3: output directory for Normalize job

#args4: output directory for Multiplication job

#args5: output directory for Sum job
