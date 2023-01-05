<template>
    <div id="page-top">
        <nav id="menu" class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand page-scroll" href="#page-top">UniChat</a>
                </div>

                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="#features" class="page-scroll">Features</a></li>
                        <li><a href="#about" class="page-scroll">About</a></li>
                        <li><a href="#services" class="page-scroll">Services</a></li>
                        <li><a href="#portfolio" class="page-scroll">Gallery</a></li>
                        <li><a href="#testimonials" class="page-scroll">Testimonials</a></li>
                        <li><a href="#team" class="page-scroll">Team</a></li>
                        <li><a href="#login" class="page-scroll"> Login <n-icon  size="18" :depth="1" :component="UserOutlined" /></a></li>
                    </ul>
                </div>  
            </div>
        </nav>
        <header id="header">
            <div class="intro">
                <div class="overlay">
                    <div class="container">
                        <div class="row">
                        <div class="col-md-8 col-md-offset-2 intro-text">
                            <h1>We Are Interact<span></span></h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam sed commodo nibh ante facilisis bibendum.</p>
                            <a href="#features" class="btn btn-custom btn-lg page-scroll">Learn More</a> </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div id="features" class="text-center">
            <div class="container">
                <div class="col-md-10 col-md-offset-1 section-title">
                    <h2>Features</h2>
                </div>
                <div class="row">
                    <div class="col-xs-6 col-md-3"> <i class="fa"><n-icon  size="48" color="#ffffff" :depth="1" :component="MessageOutlined" /> </i>
                        <h3>Lorem ipsum</h3>
                        <p  style="color: #777;">Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam.</p>
                    </div>
                    <div class="col-xs-6 col-md-3"> <i class="fa"><n-icon  size="48" :depth="1" color="#ffffff" :component="TeamOutlined" /></i>
                        <h3>Dolor sit amet</h3>
                        <p>Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque.</p>
                    </div>
                    <div class="col-xs-6 col-md-3"> <i class="fa"><n-icon  size="48" :depth="1" color="#ffffff" :component="VideoCameraOutlined" /></i>
                        <h3>Tempus eleifend</h3>
                        <p>Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam.</p>
                    </div>
                    <div class="col-xs-6 col-md-3"> <i class="fa"><n-icon  size="48" :depth="1" color="#ffffff" :component="ShareAltOutlined" /></i>
                        <h3>Pellentesque</h3>
                        <p>Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque.</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="about">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-6"> 
                        <img src="http://cdn.cunese.com.cn/FgUzPT5dSLysaT8uaIfn892Me8VH" class="img-responsive" alt=""> 
                    </div>
                    <div class="col-xs-12 col-md-6">
                        <div class="about-text">
                            <h2>About Us</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <h3>Why Choose Us?</h3>
                            <div class="list-style">
                                <div class="col-lg-6 col-sm-6 col-xs-12">
                                    <ul>      
                                        <li><n-icon  size="15" :depth="0" style="margin-right: 8px;" color="#2980dc" :component="CheckOutlined"/>Lorem ipsum dolor</li>
                                        <li><n-icon  size="15" :depth="0" style="margin-right: 8px;" color="#2980dc" :component="CheckOutlined"/>Tempor incididunt</li>
                                        <li><n-icon  size="15" :depth="0" style="margin-right: 8px;" color="#2980dc" :component="CheckOutlined"/>Lorem ipsum dolor</li>
                                        <li><n-icon  size="15" :depth="0" style="margin-right: 8px;" color="#2980dc" :component="CheckOutlined"/>Incididunt ut labore</li>
                                    </ul>
                                </div>
                                <div class="col-lg-6 col-sm-6 col-xs-12">
                                    <ul>
                                        <li><n-icon  size="15" :depth="0" style="margin-right: 8px;" color="#2980dc" :component="CheckOutlined"/>Aliquip ex ea commodo</li>
                                        <li><n-icon  size="15" :depth="0" style="margin-right: 8px;" color="#2980dc" :component="CheckOutlined"/>Lorem ipsum dolor</li>
                                        <li><n-icon  size="15" :depth="0" style="margin-right: 8px;" color="#2980dc" :component="CheckOutlined"/>Exercitation ullamco</li>
                                        <li><n-icon  size="15" :depth="0" style="margin-right: 8px;" color="#2980dc" :component="CheckOutlined"/>Lorem ipsum dolor</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { UserOutlined, TeamOutlined, VideoCameraOutlined, MessageOutlined, ShareAltOutlined, CheckOutlined } from '@vicons/antd'
import { ref } from 'vue' 
    
</script>

<style scoped lang="scss">
    @import '@/assets/css/style.css';
    @import '@/assets/css/bootstrap.css';
    @import '@/assets/css/bootstrap.min.css';
    @import '@/assets/fonts/font-awesome/css/font-awesome.css';
    p {
        color: #777;
    }

</style>