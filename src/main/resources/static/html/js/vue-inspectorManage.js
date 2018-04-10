new Vue({
    el: ".inspector-list",
    data: {
        title: 'hello vue!',
        personList:[],
        token: MyLocalStorage.Cache.get('token'),
        // web_url: "http://10.10.2.244:8082/"//董志博
        web_url: "http://10.10.7.11:8082/",
        // token:'7138065d05b04f9a90e7aa48079edb5e'
    },
    filters: {},
    mounted: function () {
        this.$nextTick(function () {
            this.cartView();
        });
    },
    methods: {
        cartView: function () {
            // let _this=this;
            // $.ajaxByPost("users/findDetectionUsers", {
            //     token: MyLocalStorage.Cache.get('token'),
            // }, function (data) {
            //     console.log(data);
            // });
            this.$http.post(this.web_url+'users/findDetectionUsers',{token:this.token}).then(res => {
                console.log(res);
                this.personList = res.body.data;
                // this.total = res.body.data.total;
            });
        },

    }

});