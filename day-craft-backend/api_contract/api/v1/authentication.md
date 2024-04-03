# Authentication
## Login User 
**Description:**
This endpoint is used to authenticate a user by verifying their credentials and logging them in.

**URL:** ```POST /api/v1/auth/login```.  
### Request Body
```json
{
    "uuid": "arnavsharma2711@gmail.com",
    "password": "getshitdone"
}
```

### Success Response
```json
{
    "success": true,
    "message": "User logged in successfully!",
    "data": {
        "id": 1,
        "email": "arnavsharma2711@gmail.com",
        "display_name": "Arnav Sharma",
        "username": "arnav_sharma_7448a2",
        "first_name": null,
        "last_name": null,
        "phone_number": null,
        "gender": null,
        "location": null,
        "profile_picture": null,
        "bio": null
    }
}
```

## Reset Password
**Description:**
This endpoint is used to initiate a password reset process for a user by sending them a reset email.

**URL:** ```POST /api/v1/auth/reset-password```.  
### Request Body
```json
{
    "uuid": "arnavsharma2711@gmail.com"
}
```

### Success Response
```json
{
    "success": true,
    "message": "Reset mail send!"
}
```

## Register User
**Description:**
This endpoint is used to register a new user. Upon successful registration, the user is automatically logged in and cookies are updated.

**URL:** ```POST /api/v1/auth/register```.  
### Request Body
```json
{
    "display_name": "Arnav Shamra",
    "email": "arnavsharma2711@gmail.com",
    "password": "getshitdone"
}
```

### Success Response
```json
{
    "success": true,
    "message": "User data created successfully!",
    "data": {
        "id": 10,
        "email": "arnavsharma2711_11@gmail.com",
        "display_name": "Arnav Shamra",
        "username": "arnav_shamra_fe2bf0"
    }
}
```

## Refresh Token
**Description:**
This endpoint is used to refresh the user's access token.

**URL:** ```PATCH /api/v1/auth/refresh-tokens```.  
### Request Body
```json
{ }
```

### Success Response
```json
{
    "success": true,
    "message": "Token refreshed successfully!"
}
```

## Logout User
**Description:**
This endpoint is used to log out a user by clearing their session cookies.

**URL:** ```GET /api/v1/auth/logout```.  
### Request Body
```json
{ }
```

### Success Response
```json
{
    "success": true,
    "message": "User logged out successfully!"
}
```
