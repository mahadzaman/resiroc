import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import moment from "moment";
import { hotjar } from "react-hotjar";
import { useParams } from "react-router-dom";
import axios from "axios";
import HeaderBlogs from "../components/header-blogs";
import { config } from "../configuration/config";
import { useNavigate } from "react-router-dom";

function postContent(content) {
  return { __html: content };
}

const Blog = () => {
  const { id } = useParams();
  const [post, SetPost] = useState({});
  let navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      /* try {
          const { data } = await axios.get(`http://localhost/api/blog/${id}`);
          SetPost(data);
        } catch (err) {
          console.error(err);
        } */
      await axios
        .get(`${config.apiUrl}api/blog/${id}`)
        .then((response) => {
          SetPost(response.data);
          // console.log(post);
        })
        .catch((err) => {
          console.log(err);
          navigate("/error");
        });
      hotjar.initialize(config.hotjarSiteId, config.hotjarHJsvId);
      hotjar.stateChange(`/landing/blogs/${post?.blog?._id}`);
    };
    fetch();
  }, [id, post?.blog?._id]);

  let tags = post?.blog?.tags.map((tag, index) => {
    return (
      <span
        style={{
          background: tag.tagColor,
        }}
        className="tag"
        key={tag._id}
      >
        {tag.tagName}
      </span>
    );
  });

  return (
    <>
      <Helmet>
        <title>Resiroc | {`${post?.blog?.title}`}</title>
      </Helmet>
      <HeaderBlogs />
      <div className="container single-blog max-w-800">
        <h3 className="text-center blog-title">{post?.blog?.title}</h3>
        <div className="text-center blog-cover">
          <img
            src={post?.blog?.headerImage?.path}
            alt={post?.blog?.headerImage?.name}
          />
        </div>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={postContent(post?.blog?.content)}
        ></div>
        <div>
          <span className="text-sm">
            {moment(post.blog?.createdAt).format("DD-MM-YYYY")}
          </span>
        </div>
        <div className="flex-wrapped align-center gap-5px tags-wrapper">
          {tags}
        </div>
      </div>
    </>
  );
};

export default Blog;
