***Settings***
Documentation       This is a resource file containing all the keywords
Library     ./libs/WebTest.py

***Keywords***

Create New User
    [Arguments]  ${email}  ${username}  ${password}
    Set Email  ${email}
    Set Username  ${username}
    Set Password  ${password}
    Create User

Login In User
    [Arguments]  ${username}  ${password}
    Set Username  ${username}
    Set Password  ${password}
    Login User

Create a Brewery
    [Arguments]  ${username}  ${password}
    Set Username  ${username}
    Set Password  ${password}
    Login User
    Create Brewery

Edit a Brewery
    [Arguments]  ${username}  ${password}
    Set Username  ${username}
    Set Password  ${password}
    Login User
    Edit Brewery

Delete a Brewery
    [Arguments]  ${username}  ${password}
    Set Username  ${username}
    Set Password  ${password}
    Login User
    Delete Brewery