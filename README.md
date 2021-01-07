

1. Connect to DB
2. Delete all existing product entries (I don't want previous data stored, as the app is supposed to display the recent prices)
3. Use Axios and Cheerio to scrape through a list of gym websites for prices and store them in DB

I'm kind of proud of the code responsible for point 3 - I have an array of objects (const gyms) containing the link and scraping tags for each site, 
then a function accepting two parameters (const getGymData(gym,params)) - link to site and tags, then the array is mapped and the function is executed for each item in 
the array - this approach allowed me to refactor the code from 400+ lines to 160 (including comments and empty lines for clarity)
