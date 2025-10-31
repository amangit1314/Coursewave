24-05-2025
15-10-2025
16-10-2025
22-10-2025
23-10-2025
24-10-2025
26-10-2025
27-10-2025
28-10-2025

---

1. [] Website lates too much time to load
2. [] It takes time to redirect me to the `/browse` after successfull login toast.

------------------------------------ ABOUT & CONTACT -------------------

3. [] handle states (success, error, no internet etc.) and Send Mail is not working on `/helpAndSupport`
4. [] - handle states (success, error, no internet etc.) and Send Mail is not working on `/forgotPassword` + `/resetPassword`
5. [] - Fix and make `/verifyEmail` working perfectly.

------------------------------------------ ARTICLE --------------------------------------

6.  [] - article item in articles (
        [x] - claps count,
        [x] - like (clap),
        [] - like (clapped) status,
        [] - comments count,
        [x] - save and unsave,
        [x] - saved status,
        [x] - share,
        [] - follow / unfollow author,
        [x] - report article
        [] - article rating
    )
7. [] - Article Details (
        [] - like count (
                [] If already liked the article, in article details its not  showing filled
                [] - i am able to like again and again (restrict a user can like only once, and if clicked again it will be disliked) {This is working on article item}
                [x] - its working locally via cache perfectly
                [] - no states toast messages and handle loading such that show ... at time of load (DO ONLY IF NECESSARY) 
            )
        [] - views count updates <---
        [] - author profile page with (
            [] - follow / unfollow author,
            [] - report author,
            [] - author articles,
            [] - author courses
        )
        [] - Article rating (
            [] - on article card
            [] - on just below the main title of article
            [] - rating stars
            [] - rate article form
            [] - can't rate again if already rated
            [] - handle all states
        )
        [x] - comment management for article (
            [x] - fix ui issues
            [x] - handle cases (no articles, error)
            [x] - write comment
            [] - edit comment
            [] - delete comment
            [] - like comment
        )
    )

----------------- COURSE ------------------------------------------
8. Course Item (
    [] - Add course to wishlist
    [] - Status of wishlisted course item
    [] - on tap again remove from wishlist
)
9. Course Details (
    [] - back button, coursewave logo and course name can conflict in ui handle the scenarios in course details header (mobile view only)
    [] - mobile view breadcrumn the course name is not showing
    [] - enrolled students count, from backend
    [] - Course level 
    [] - the course right section of big screen one is comming down in the mobile view for mobile view think about something different organization or just (flex-reverse [only in mobile view])
    [x] - share course url
    [] - apply `couponCode` from couponCode dialog on course details page.
    [] - add to cart
    [] - Course Enrollment
    [] - Course purchase
    [] - Course allocation
    [] - Course purchased email
    [] - Successfully enrolled in course notification
    [] - Course content (
        [] - total duration calculation
        [] - duration next to every chapter
        [] - free video playback only (when user is not enrolled or not loggedIn)
    )
    [] - Course review (
        [x] - list reviews
        [] - write review
        [] - edit review
        [] - delete review
        [] - update the review and rating bifercation in cache at real time (optimistic update)
    )
)
10. [] - Course Content on learning side (
        [] - text, quiz and video handling (based on content type)
        [] - Video Ai Summary (only when content type is video)
        [] - Chapter Notes Management
        [] - show reviews of course in here at time of learning (NEED DICSUSSOn)
    )

---------------------- CART -------------------------------------------
11. [] - Cart (
        [] - states (empty, error, loading)
        [] - Cart items
        [] - Remove from cart
        [] - Cart total
        [] - Cart checkout
        [] - Cart coupon codes
    )

----------------------- WISHLIST -------------------------------------
12. [] - Wishlist (
        [] - states (empty, error, loading)
        [] - wishlisted items
        [] - Remove from wishlist
        [] - Add wishlisted item to cart
    )

------------------------ SUBSCRIPTION -----------------------------
13. [] - subscription 

-------------------- FIXES ------------------------------------------    
14. [x] - back icon is missing on (cart + wishlist) <---
15. [] - cart and wishlist not found error when user is not authenticated, restrict navigation on them in this case
16. [] - Edit chapter (edit description, title is working but need to reload to see the change in the chapters list of section)
17. [] - Delete article didn't refresh articles immediately needs to refresh or reload page to see change.

----------------------- OPTIONAL FIXES -----------------------------------

[] - Publish button should show a cursor pointer on `/write` article button
[] - Make send email button cursor pointer on `/forgotPassword` 
[] - Improve loading shimmer of 
    [] - articles 
    [] - cart
    [] - wishlist
    [] - article details
[] - on learning goal checkbox it should be cursor pointer on hover. 
[] - on click on save change, should show a cursor pointer 
[] - Back to articles should change color on hover to blue 
[] - In featured image, the edit and delete button should show cursor pointer on hover 
[] - write button should show the cursor pointer on hover  on `/article` details
[] - Make apply button hover, and show a cursor pointer on `couponCode` dialog. 

------------------------- CHECKS ------------------------------------------
[] - Change password the dialog is not closing on success (CHECK)
[] - pagination for articles (CHECK)
[] - pagination for courses (CHECK)
[] - show learning activity for the logged in user, current learning activity chart is wrong in `/dashboard`(CHECK)
[] - learning activity, colors of course students, sessions students is not correctly in `/dashboard`(CHECK)
[] - the color reflects when i hover in `/dashboard` on learning activity chart(CHECK)
[] - on dark mode, the data points are still dark in dark mode where it must be white in `/dashboard` learning activity chart(CHECK)


-------------------------- LESS PRIORITY FOR CURRENT VERSION --------------
- show more from author,
- show less from author,
- show more articles like this
- show less articles like this
- mute author,
- Have an actual introduction video in landing about section
- make the Signup for newletter working (OPTIONAL [NOT IMPLEMENTED])
