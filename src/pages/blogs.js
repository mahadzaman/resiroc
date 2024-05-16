/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import moment from "moment";
import { hotjar } from "react-hotjar";
import HeaderBlogs from "../components/header-blogs";
import axios from "axios";
import { Link } from "react-router-dom";
import { config } from "../configuration/config";

const Blogs = () => {
  const singlePageItems = 10;
  const [blogs, SetBlogs] = useState([]);
  const [blogsCount, SetBlogsCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch();
    hotjar.initialize(config.hotjarSiteId, config.hotjarHJsvId);
    hotjar.stateChange("/landing/blogs");
  }, [page]);

  const pageChangehandler = (_page) => {
    setPage(_page);
  };

  const fetch = async () => {
    try {
      const { data } = await axios.get(`${config.apiUrl}api/blog`, {
        params: {
          records_per_page: singlePageItems,
          page_no: page,
        },
      });
      SetBlogsCount(data.blogsCount);
      SetBlogs(data.blogs);
      // setupPagi(data.blogsCount);
    } catch (err) {
      console.log(err);
    }
  };

  const blogsMarkup = blogs?.map((blog, index) => {
    let blogIndex = index;
    let tags = blog?.tags?.map((tag, index) => {
      return (
        <h6
          className="px-2 open-sans py-1 text-sm rounded"
          style={{
            color: "#fff",
            backgroundColor: tag?.tagColor,
          }}
          key={`blog-${blogIndex + 1}-tag-${index + 1}`}
        >
          {tag?.tagName}
        </h6>
      );
    });
    return (
      <>
        <Helmet>
          <title>Resiroc | Blogs</title>
        </Helmet>
        <div id={blog?._id} className="single-blog-item" key={`blog-${index}`}>
          <div className="blog-img">
            <img
              className="w-full h-full object-cover"
              src={blog?.headerImage?.path}
              alt="cover"
            />
          </div>
          <div className="blog-summary raw-flex dir-col">
            <div className="raw-flex dir-col">
              <Link
                to={`/landing/blogs/${blog?._id}`}
                className="text-xl decoration-none text-semibold text-gray-900"
              >
                {blog.title}
              </Link>
              <p className="mt-4 text-gray-400 text-sm">{blog?.preview}</p>
            </div>

            <div className="raw-flex space-between align-center mar-t-auto">
              <div className="raw-flex space-between align-center">
                <div>
                  <p className="text-sm text-gray-400">
                    {moment(blog?.createdAt).format("DD-MM-YYYY")}
                  </p>
                </div>
              </div>

              <Link
                to={`/blogs/${blog?._id}`}
                className="text-blue-400 hover:text-blue-500 block"
              >
                Read More
              </Link>
            </div>

            <div className="flex-wrapped gap-3 align-center">{tags}</div>
          </div>
        </div>
      </>
    );
  });
  let pages = Math.ceil(blogsCount / singlePageItems);
  let arr = [];
  for (let i = 1; i <= pages; i++) {
    arr.push(i);
  }

  return (
    <>
      <title>Resiroc | Blogs</title>
      <HeaderBlogs />

      <section className="blogs py-5">
        <div className="container">
          <div className="container">
            <div className="mar-b-40">
              <h2 className="font-extrabold text-center">Our Blogs</h2>
            </div>
            <div>{blogsMarkup}</div>
            <nav
              className="raw-flex just-center mar-t-30"
              aria-label="Page navigation example"
            >
              <ul className="pagination">
                {arr.map((pageNo) => {
                  return (
                    <li className="page-item" key={pageNo}>
                      <button
                        className={`page-link ${
                          pageNo === page ? "active" : ""
                        }`}
                        href="#"
                        onClick={() => pageChangehandler(pageNo)}
                      >
                        {pageNo}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blogs;
