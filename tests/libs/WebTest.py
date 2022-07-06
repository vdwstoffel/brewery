from msilib.schema import Error
from regex import B
from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep


class WebTest:
    """Check if a new user can be registerd and if a new user can be logged in"""

    def __init__(self) -> None:
         # Driver Setup
        options = webdriver.ChromeOptions()
        options.add_argument("disable-infobars")
        options.add_argument("start-maximized")
        options.add_argument("disable-dev-shm-usage")
        options.add_argument("no-sandbox")
        options.add_argument("disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])

        self.driver = webdriver.Chrome(executable_path="C:\Development\chromedriver.exe", options=options)
        self.driver.implicitly_wait(1)

        self.url = "http://localhost:3000/"


    def set_email(self, email):
        self.email = email

    def set_username(self, username):
        self.username = username

    def set_password(self, password):
        self.password = password

    def create_user(self):
        self.driver.get(self.url)
        self.driver.find_element(by=By.XPATH, value='//*[@id="navbarNav"]/ul[2]/li[1]/a').click()
        self.driver.find_element(by=By.ID, value="floatingEmail").send_keys(self.email)
        self.driver.find_element(by=By.ID, value="floatingUsername").send_keys(self.username)
        self.driver.find_element(by=By.ID, value="floatingPassword").send_keys(self.password)
        self.driver.find_element(by=By.CLASS_NAME, value="btn-login").click()

        try:
            self.driver.find_element(by=By.CLASS_NAME, value="alert-success")
        except:
            raise Error("Create User Failed")


    def login_user(self):
        self.driver.get(self.url)
        self.driver.find_element(by=By.XPATH, value='//*[@id="navbarNav"]/ul[2]/li[2]/a').click()

        #Enter username + password
        self.driver.find_element(by=By.ID, value="floatingUsername").send_keys(self.username)
        self.driver.find_element(by=By.ID, value="floatingPassword").send_keys(self.password)
        self.driver.find_element(by=By.CLASS_NAME, value="btn-login").click()

        #check success
        try:
            self.driver.find_element(by=By.CLASS_NAME, value="alert-warning")
        except:
            pass
        else:
            raise Error("User could not be logged in")

    def create_brewery(self):
        self.driver.get(self.url)
        self.driver.find_element(by=By.XPATH, value='//*[@id="navbarDropdown"]').click()
        self.driver.find_element(by=By.XPATH, value='//*[@id="navbarNav"]/ul[1]/li[2]/ul/li[2]/a').click()

        #Insert Fields into the brewery
        self.driver.find_element(by=By.ID, value="name").send_keys("AA Robot Brewery")
        self.driver.find_element(by=By.ID, value="founded").send_keys("2020")
        self.driver.find_element(by=By.ID, value="city").send_keys("Robotville")
        self.driver.find_element(by=By.ID, value="country").send_keys("The Matrix")
        self.driver.find_element(by=By.ID, value="description").send_keys("This is a robot test")
        self.driver.find_element(by=By.ID, value="logo_path").send_keys("https://academy.brightest.be/wp-content/uploads/2020/10/Robot-Framework.png")
        self.driver.find_element(by=By.ID, value="website").send_keys("https://robotframework.org/")
        self.driver.find_element(by=By.CLASS_NAME, value="submitButton").click()

        try:
            self.driver.find_element(by=By.CLASS_NAME, value="brewery-info")
        except:
            raise Error("Brewery could not be created")

    def edit_brewery(self):
        self.driver.get(self.url)
        self.driver.find_element(by=By.XPATH, value='//*[@id="navbarDropdown"]').click()
        self.driver.find_element(by=By.XPATH, value='//*[@id="navbarNav"]/ul[1]/li[2]/ul/li[1]/a').click()

        self.driver.find_element(by=By.CLASS_NAME, value='btn-dark').click()
        self.driver.find_element(by=By.CLASS_NAME, value="btn-primary").click()

        #submit changes
        self.driver.find_element(by=By.CLASS_NAME, value="submitButton").click()
        # Check flash message
        try:
            self.driver.find_element(by=By.CLASS_NAME, value="alert-success")
        except:
            raise Error("Could not edit brewery")

    def delete_brewery(self):
        self.driver.get(self.url)
        self.driver.find_element(by=By.XPATH, value='//*[@id="navbarDropdown"]').click()
        self.driver.find_element(by=By.XPATH, value='//*[@id="navbarNav"]/ul[1]/li[2]/ul/li[1]/a').click()

        #Find the test brewery
        self.driver.find_element(by=By.CLASS_NAME, value='btn-dark').click()
        self.driver.find_element(by=By.CLASS_NAME, value="btn-danger").click()

        try:
            self.driver.find_element(by=By.CLASS_NAME, value="alert-success")
        except:
            raise Error("Brewery Could not be deleted")
