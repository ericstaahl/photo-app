# photo-app
## Photo API primarily made with express.js and bookshelf.js.<br>Fetches data from a MySQL-database.  

With this app a photo (an entry in the database containing a link to a picture)  
can be added to the currently logged in user (access granted via JWT).  
This user can also create albums to which these photos can be added.  
Albums and photos can also be deleted by their corresponding user.

## These were the general requirements for the app
- All passwords must be salted and hashed.  
- All received data must be sanitized and validated.  
- All endpoints for photos and albums must require authentication.  
- JSON Web Tokens must be used.  
- Refresh of access token must work.


## Example of response from the API
<img width="769" alt="Skärmavbild 2022-04-22 kl  15 51 36" src="https://user-images.githubusercontent.com/94179820/164728102-7f2dcfcf-b260-47c6-9ff0-cd54de243193.png">

