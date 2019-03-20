# Lowishigh

## A fully-featured blog

### [Click here to view the blog in action](https://lowishigh.com)


This was my first real web dev project that I created from scratch. Of course, it's not perfect, but it works and I'm proud of it, and I learned a lot building it. It's a replacement for the old Wordpress site that my girlfriend was using as her blog page.

#### Features

* Full admin panel that allows the user to create new blog posts (with in-browser text editor and a drag-and-drop based system for arranging images around the text), upload images, edit the gallery, post new projects they've been working on, reply to comments, and delete user accounts or comments.

* User authentication using Json Web Tokens. These are saved in the database with a two-day expiry, after which they are deleted and the user must log in again. On the client side, they are stored in the browser and checked for validity upon a refresh.

* Password hashing and salting with Bcrypt and a token-based password reset function that uses email verification. When the user wants to reset their password, a token is sent to both their primary and backup emails with a 5 minute expiry.

* Rate limiting

* HTTPS

* Mobile-friendly, modern, responsive interface

* On the blog categories page, thumbnail images are intelligently chosen. For each blog category, it will first check whether an admin has manually set an image for that category. For the categories that have not had their images manually set, it will try to find an image for each category from the title images of the blog posts within that category, prioritising the blog categories with the least amount of posts in them. At the end of this process, if two categories end up having the same image, another image will be chosen for the category with more posts. Perhaps this was over-engineering, but I really like the fact that this works this way, without looking too much like spaghetti code.

* Easy social sharing with unique links below every article

* Tested on Safari, Chrome and Firefox on desktop and mobile

#### Technologies used

The project uses Bootstrap, SCSS, React and Redux on the frontend, and Express/NodeJS with MongoDB on the backend. I chose this stack because I had just completed quite a lengthy MOOC on Coursera using the same set of technologies, and I wanted to create my own thing to prove that I had truly acquired those skills. If I were to start the project from scratch again today, I would probably choose to use an SQL database, but other than that I think React and Express were good choices. Perhaps I would go for NextJS rather than create-react-app, because I think server-side rendering would probably be a nice improvement, especially in terms of SEO. 

I also wrote a python script to automatically add new Harper's Bazaar articles that my girlfriend wrote to the articles section of the blog.

This is because she is doing an internship there and wrties new articles there all the time, but unfortunately Harper's Bazaar (a very popular fashion magazine/media company) and its parent company Hearst don't offer a public API. They seem to have launched one in 2014, but then sort of abandoned it and it now no longer works. On top of that, in order to fetch the images, one needs to actually load the page in the browser rather than simply using a HTML scraping tool such as python's requests module, because they have some sort of infinite scrolling javascript going on that doesn't actually place the images on the DOM unless you actually open the page manually. So, I used Selenium with Firefox. The script worked well, but unfortunately the little VPS I use to host the site doesn't have enough RAM to run it properly, so I've ended up just adding the articles manually. In a perfect world, I would pay for better hosting and there hopefully wouldn't be any issues there. The python script is in the repo (parseHarpersArticles.py).

#### Areas where I think the project could improve

* Some of the code needs to be simplified and untangled a bit. Seeing as this was a project that only I will conceivably ever work on, and I tried to set a deadline for myself of January 31st to have the site live (which was a success), there are some files that I didn't quite have time to clean up and should really have been split into several components. In a real working environment, I would work on this a bit harder.

* A lot of time could have been saved by using a strong typing system such as TypeScript. There were many times that I was frustrated and searching madly through stack overflow for 'why on earth does this function return [object Object]?' Only to discover it was some silly mistake where I passed the wrong thing as props or something like that.

* I would like to improve the security of the site. I think that the level of security I put in place was adequate considering there's no real motivation for an attacker to try and hack the site, but I think there are still areas where it could be improved, such as the database.

#### Screenshots

![Screenshot 1](/Screenshot_1.png)

![Screenshot 2](/Screenshot_2.png)

![Screenshot 3](/Screenshot_3.png)

![Admin panel gif](/Admin_panel.gif)
