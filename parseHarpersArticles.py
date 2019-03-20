import json
import time
from pyvirtualdisplay import Display
from selenium import webdriver
from bs4 import BeautifulSoup
import datetime
import dateutil.parser
from selenium.webdriver.support.ui import WebDriverWait
import requests

# Here is a guide for how to set this up on your linux server
# https://blog.testproject.io/2018/02/20/chrome-headless-selenium-python-linux-servers/

# You need xvfb, selenium, pyvirtualdisplay, and geckodriver
# This script takes like 10 minutes to run, make it more efficient if possible

try:
    display = Display(visible=0, size=(1024, 768)) 
    display.start()
    driver = webdriver.Firefox() # Breaks here with 'connection refused' on firefox when on server, most likely due to insufficien
    driver.get('https://www.harpersbazaar.com/tw/author/17684/eachen-lee/')

    count = 0

    articles = set()


    for i in range(5): 
        
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        WebDriverWait(driver, 10).until(lambda d: d.execute_script('return document.readyState') == 'complete')

    images = driver.find_elements_by_class_name("lazyimage")
    for image in images:
        driver.execute_script("arguments[0].scrollIntoView();", image)
        time.sleep(1)
        print('Making sure images are loaded properly...')
        
    soup = BeautifulSoup(driver.page_source, features="html5lib")
    current_articles = soup.find_all('div', class_='full-item')
    for item in current_articles:
        articles.add(item)

    articles_to_remove = []
    itemDateDict = {}
    for item in articles:
        for child in item.descendants:
            if child.name == 'div':
                if 'data-publish-date' in child.attrs:
                    item_date = dateutil.parser.parse(child.attrs['data-publish-date'], ignoretz=True).date()
                    if item_date < datetime.date(2018, 7, 25):
                        articles_to_remove.append(item)
                    else:
                        itemDateDict[item] = item_date


    for item in articles_to_remove:
        articles.remove(item)

    articles_not_to_remove = []
    for item in articles:
        for child in item.descendants:
            try:
                if child.name == "span":
                    if 'byline-name' in child.attrs['class']:
                        if 'Lois Yeh' in child.string:
                            articles_not_to_remove.append(item)
            except:
                continue

    articles_to_remove = []

    for item in articles:
        if item not in articles_not_to_remove:
            articles_to_remove.append(item)

    for item in articles_to_remove:
        articles.remove(item)

    articles = list(articles)

    articles.sort(key=lambda item: itemDateDict[item], reverse=True)



    output_data = []
    baseURL = "https://www.harpersbazaar.com"
    count = 0

    for item in articles:
        output_data_add = {'img': {}, 'id': count}
        output_data_add['date'] = itemDateDict[item].isoformat()
        for child in item.descendants:
            if child.name == 'a' and "full-item-title" in child.attrs['class']:
                output_data_add['title'] = child.string.lstrip('\n\t').rstrip('\n')
                output_data_add['link'] = baseURL + child.attrs['href']
            elif child.name == 'img' and "lazyloaded" in child.attrs['class']:
                output_data_add['img']['alt'] = child.attrs['alt']
                output_data_add['img']['src'] = child.attrs['src']
        if output_data_add['img'] == None or output_data_add['title'] == None or output_data_add['link'] == None:
            raise IOError
        output_data.append(output_data_add)
        count += 1
    
    print(output_data)
    

    with open('harpersbazaar.json', 'w') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=4)

    url = "https://lowishigh.com/harpers_bazaar"

    for item in output_data:
        newData = {}
        newData['name'] = item['name']
        newData['data'] = item['data']
        newData['data']['author'] = "5c30c9d3f00f49089043ccd5"
        print(newData, type(newData))
        response = requests.post(url, json=json.dumps(newData, indent=4, ensure_ascii=False), verify=False)
        print(response)
    
    print("成功")
    display.stop()
    driver.quit()

    
except:
    driver.quit()
