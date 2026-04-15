# HNG Stage 1 – Data Processing & Persistence API
## Overview
This project is a RESTful API built as part of the HNG Stage 1 Backend assessment. It processes user-provided names by integrating with multiple external APIs, applies classification logic, persists the data in a database, and exposes endpoints to manage the data.

## Tech Stack
* Node.js
* Express.js
* MongoDB (Mongoose)
* Axios (for external API calls)
* UUID v7 (for unique IDs)
* CORS

## Base URL
https://your-app-url.com

## Features
* Accepts a name and processes it using 3 external APIs
* Classifies age into groups
* Determines most probable nationality
* Stores processed data in MongoDB
* Prevents duplicate entries (idempotency)
* Provides filtering capabilities
* Handles edge cases and external API failures
* Fully RESTful API design

## External APIs Used
* Genderize → https://api.genderize.io
* Agify → https://api.agify.io
* Nationalize → https://api.nationalize.io

## Classification Logic
### Age Groups
* 0–12 → child
* 13–19 → teenager
* 20–59 → adult
* 60+ → senior

### Nationality
* Selects country with the highest probability

## API Endpoints
### Create Profile
**POST** `/api/profiles`

#### Request Body
{
"name": "ella"
}

#### Success Response (201)
{
"status": "success",
"data": {
"id": "uuid-v7",
"name": "ella",
"gender": "female",
"gender_probability": 0.99,
"sample_size": 1234,
"age": 46,
"age_group": "adult",
"country_id": "DRC",
"country_probability": 0.85,
"created_at": "2026-04-01T12:00:00Z"
}
}

#### Duplicate Case (200)
{
"status": "success",
"message": "Profile already exists",
"data": { ...existing profile }
}

### Get Single Profile
**GET** `/api/profiles/:id`

#### Response (200)
{
"status": "success",
"data": { ...profile }
}

### Get All Profiles
**GET** `/api/profiles`

#### Query Params (optional)
* gender
* country_id
* age_group

Example:
/api/profiles?gender=male&country_id=NG

#### Response (200)
{
"status": "success",
"count": 2,
"data": [ ...profiles ]
}

### Delete Profile
**DELETE** `/api/profiles/:id`

#### Response
204 No Content

## Error Handling

### Standard Format
{
"status": "error",
"message": "Error message"
}

### Errors
* 400 → Missing name
* 422 → Invalid input type
* 404 → Profile not found
* 502 → External API failure
* 500 → Server error

### External API Error Example
{
"status": "error",
"message": "Agify returned an invalid response"
}


## Data Model

### Profile Schema
* id (UUID v7)
* name (unique)
* gender
* gender_probability
* sample_size
* age
* age_group
* country_id
* country_probability
* created_at

## Idempotency
* Prevents duplicate profiles by checking if a name already exists
* Returns existing record instead of creating a new one

## Filtering
Supports case-insensitive filtering:
* gender
* country_id
* age_group

## CORS
Access-Control-Allow-Origin: *

## Time Format
All timestamps are in UTC ISO 8601

## Testing
Tested using:
* Postman
* Browser
* Multiple network environments

## Notes
* Built with scalability and clean architecture in mind
* All responses strictly follow required format
* External API failures are handled gracefully