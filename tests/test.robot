***Settings***
Documentation       Perform basic user interaction
Resource        keywords.resource

*** Test Cases *** 
# Create a new user
#     Create New User  test@email.com  stoffel  123

Attempt to login User   
    Login In User  stoffel  123

Create a new Brewery
    Create a Brewery  stoffel  123

Edit a Brewery
    Edit a Brewery  stoffel  123

Delete a Brewery
    Delete a Brewery  stoffel  123
