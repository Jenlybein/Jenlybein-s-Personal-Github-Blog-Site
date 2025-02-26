import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/Home/Home.vue";
import Test2 from "@/pages/About/About.vue";
import HomeTitle from "@/pages/Home/HomeTitle.vue";
import RightSidebar from "@/pages/RightBar/RightSidebar.vue";
import PagesTitle from "@/components/PagesTitle.vue";
import Article from "@/pages/Article/Article.vue";
import Tags from "@/pages/Tags/Tags.vue";
import ArticleTitle from "@/pages/Article/ArticleTitle.vue";
import Category from "@/pages/Cag/Category.vue";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "home",
      path: "/",
      components: {
        default: Home,
        title: HomeTitle,
        rightsidebar: RightSidebar,
      },
    },
    {
      path: "/home",
      redirect: "/",
    },
    {
      name: "tags",
      path: "/tags",
      components: {
        default: Tags,
        title: PagesTitle,
        rightsidebar: RightSidebar,
      },
    },
    {
      name: "categories",
      path: "/categories",
      components: {
        default: Category,
        title: PagesTitle,
        rightsidebar: RightSidebar,
      },
    },
    {
      name: "about",
      path: "/about",
      components: {
        default: Test2,
        title: PagesTitle,
        rightsidebar: RightSidebar,
      },
    },
    {
      name: "article",
      path: "/article/:id",
      components: {
        default: Article,
        title: ArticleTitle,
        rightsidebar: RightSidebar,
      },
    },
    {
      name: "search",
      path: "/",
      components: {
        default: Home,
        title: PagesTitle,
        rightsidebar: RightSidebar,
      },
    },
  ],
});

export default router;
