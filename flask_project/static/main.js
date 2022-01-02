const { createApp } = Vue 
console.log("hello")
const UserApp = {
    data(){
        return {
            user:{
                "username": "", 
                "password": ""
            },
            error: "",
            likedNews: [],
            news:[],
            // news:[{
            //     "image_url":"https://i.gadgets360cdn.com/large/dogecoin_bloomberg_small_1613366240619.jpg",
            //     "title":"How to Fight Fraud with Artificial Intelligence and Intelligent Analytics",
            //     "pubDate": "2021-05-11 10:15:23",
            //     "description":"It was billionaire Elon Musk, who until now regularly talked about Dogecoin, a cryptocurrency that began as a meme joke, but now is worth $93.38 billion. And now a \"Dogecoin Rap\", written and...",
            //     "content":"",
            //     "creator":"newsfeedback@fool.com (Sean Williams)",
            //     "liked": false
            // },
            // {
            //     "image_url":"https://i.gadgets360cdn.com/large/dogecoin_bloomberg_small_1613366240619.jpg",
            //     "title":"How to Fight Fraud with Artificial Intelligence and Intelligent Analytics",
            //     "pubDate": "2021-05-11 10:15:23",
            //     "description":"It was billionaire Elon Musk, who until now regularly talked about Dogecoin, a cryptocurrency that began as a meme joke, but now is worth $93.38 billion. And now a \"Dogecoin Rap\", written and...",
            //     "content":"",
            //     "creator":"newsfeedback@fool.com (Sean Williams)",
            //     "liked": true
            // },  
            // {
            //     "image_url":"https://i.gadgets360cdn.com/large/dogecoin_bloomberg_small_1613366240619.jpg",
            //     "title":"How to Fight Fraud with Artificial Intelligence and Intelligent Analytics",
            //     "pubDate": "2021-05-11 10:15:23",
            //     "description":"It was billionaire Elon Musk, who until now regularly talked about Dogecoin, a cryptocurrency that began as a meme joke, but now is worth $93.38 billion. And now a \"Dogecoin Rap\", written and...",
            //     "content":"",
            //     "creator":"newsfeedback@fool.com (Sean Williams)",
            //     "liked": false
            // }
        
            // ],
            newfeed:{
                "title":"How to Fight Fraud with Artificial Intelligence and Intelligent Analytics",
                "pubDate": "2021-05-11 10:15:23",
                "description":"It was billionaire Elon Musk, who until now regularly talked about Dogecoin, a cryptocurrency that began as a meme joke, but now is worth $93.38 billion. And now a \"Dogecoin Rap\", written and...",
                "content":"",
                "creator":"newsfeedback@fool.com (Sean Williams)"
            }
        }
    }, 
    delimiters:["{","}"],

    created(){
        this.getLikeNews()
        this.getNews()
        
    },
    methods:{
        async signup(){
            await fetch(window.location, {
                method: "post",
                headers:{
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHTTpRequested"
                },
                body: JSON.stringify(this.user)
                }
            ).then(reponse => reponse.json())
            .then(data=> {
                if (data.error == "None"){
                    this.error = ""
                    window.location.href= "/login"
                    
                }

                this.error = data.error
                
            })
        },
        async login(){
            await fetch(window.location,{
                method: "Post",
                headers:{
                    "Content-Type": "application/json", 
                    "X-Requested-With": "XMLHTTpRequested"
                },
                body: JSON.stringify(this.user)

            })
            .then(response=> response.json())
            .then(data => {
                if (data.error == "None"){
                    window.location.href= "/home"
                    this.error = ""
                }
                this.error = data.error
            })
        },
        async getNews(){
            await fetch("https://newsdata.io/api/1/news?apikey=pub_32587a3d76867b3cbd29e9f408adafb71954&q=dogecoin", {
                method: "Get"
            })
            .then(response=>response.json())
            .then(data=> {
                this.news = data.results
                
                for(var i =0 ; i < this.news.length; i++){
                    console.log(this.likedNews.length)
                    var ischeck = false;
                    for (var j =0; j < this.likedNews.length; j++){
                        
                        if (this.likedNews[j][2] == this.news[i].title){
                            this.news[i].liked = this.likedNews[j][3]
                            ischeck = true;
                            break
                        }
                    }
                    if (ischeck == false){
                        this.news[i].liked = false;
                    }
                }
            })
        },
        async getLikeNews(){
            await fetch("/likedNews",{
                method: "Get", 
                headers:{
                    "X-Requested-With": "XMLHTTpRequested"
                }
            })
            .then(response=> response.json())
            .then(data => this.likedNews= data)
        },
        async likeNews(news){
            await fetch("/like", {
                method : "POST", 
                headers:{
                    "Content-Type": "application/json",
                    "X-Requsted-With": "XMLHTTpRequested"
                }, 
                body: JSON.stringify(news)
            })
            .then(response => response.json())
            .then(data => console.log(data))
            await this.getLikeNews()
            await this.getNews()
        }
    }

}

createApp(UserApp).mount("#app")