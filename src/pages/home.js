import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import moment from "moment";
import { hotjar } from "react-hotjar";
import Header from "../components/header";
import QuickSetup from "../assets/images/quick_setup.png";
import RentCollection from "../assets/images/rent_collection.png";
import ManageProperty from "../assets/images/manage_property.png";
import StartupServices from "../assets/images/startup_services.png";
import InfoDashboard from "../assets/images/info_dashboard.png";
import ManageDocuments from "../assets/images/manage-documents.png";
// import ContactImage from "../assets/images/contact-image.png";
import logo from "../assets/images/logo.png";
import { config } from "../configuration/config";
import axios from "axios";

class home extends React.Component {
  constructor(props) {
    super(props);
    this.featureRef = React.createRef();
    this.priceRef = React.createRef();
    this.blogRef = React.createRef();
    this.contactRef = React.createRef();
    this.state = {
      blogsData: {},
      userName: "",
      email: "",
      phoneNumber: "",
      message: "",
      result: 10,
    };
  }

  componentDidMount = async () => {
    await this.getBlogs();
    hotjar.initialize(config.hotjarSiteId, config.hotjarHJsvId);
    hotjar.stateChange("/landing");
  };

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  async getBlogs() {
    await axios
      .get(`${config.apiUrl}api/blog/`, {
        params: {
          records_per_page: 3,
          page_no: 1,
        },
      })
      .then((response) => {
        this.setState({
          blogsData: response.data.blogs,
        });
        // console.log(this.state.blogsData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  contactUsHandler = async (e) => {
    try {
      e.preventDefault();
      const obj = {
        userName: this.state.userName,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber,
        message: this.state.message,
      };
      await axios.post(`${config.apiUrl}api/admin/feedback`, obj);
      this.setState({
        userName: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
      document.getElementById(`showMessage`).classList.remove("d-none");
      this.setTimeout(() => {
        document.getElementById(`showMessage`).classList.add("d-none");
      });
    } catch (err) {
      alert("error in sending message");
      this.setState({
        userName: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
    }
  };

  allowNumbersOnly = (e) => {
    var key = e.keyCode ? e.keyCode : e.which;
    // console.log(e.keyCode);

    if (
      !(
        [8, 9, 13, 27, 46, 190].indexOf(key) !== -1 ||
        (key === 65 && (e.ctrlKey || e.metaKey)) ||
        (key >= 35 && key <= 40) ||
        (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) ||
        (key >= 96 && key <= 105)
      )
    )
      e.preventDefault();
  };

  calculation = (e) => {
    let result = 10;
    let val = parseInt(e.target.value);

    if (isNaN(val)) {
      val = 5;
      result = 10;
      this.setState({ result: result });
    }
    if (val > 5) {
      result += (val - 5) * 0.8;
      result = result.toFixed(2);
      // console.log(result);
      this.setState({ result: parseFloat(result) });
    } else this.setState({ result: 10 });
  };

  render() {
    const blogs = this.state.blogsData;
    const blogsMarkup = [];
    // console.log(this.state.blogsData)
    // let counter = 0;
    for (let i = 0; i < blogs.length; i++) {
      let tagsGroup = [];
      // counter += 1;
      for (let tag = 0; tag < blogs[i].tags.length; tag++) {
        tagsGroup.push(
          <h6
            className="px-2 open-sans py-1 text-sm rounded"
            style={{
              color: "#fff",
              backgroundColor: blogs[i].tags[tag].tagColor,
            }}
            key={`blog-${i + 1}-tag-${tag + 1}`}
          >
            {blogs[i].tags[tag].tagName}
          </h6>
        );
      }
      blogsMarkup.push(
        <div className="col-md-4" id={blogs[i]._id} key={i}>
          <div className="rounded-lg shadow-lg bg-white overflow-h height-100 raw-flex dir-col">
            <div className="flex-shrink-0">
              <img
                className="h-48 w-full object-cover"
                src={blogs[i].headerImage?.path}
                alt="cover"
              />
            </div>
            <div className="pad-15">
              <Link
                to={`/landing/blogs/${blogs[i]._id}`}
                className="block mt-2 decoration-none"
              >
                <p className="text-xl font-semibold text-gray-900">
                  {blogs[i].title}
                </p>
                <p className="mt-3 text-base text-gray-500">
                  {blogs[i].preview}
                </p>
              </Link>
            </div>
            <div className="mar-t-auto pad-15">
              <div className="mt-6 flex items-center">
                <div className="ml-3">
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <time>
                      {moment(blogs[i].createdAt).format("DD-MM-YYYY")}
                    </time>
                  </div>
                </div>
              </div>
              <div className="flex-wrapped gap-3 align-center mar-t-10 just-center">
                {tagsGroup}
              </div>
            </div>
          </div>
        </div>
      );
      // if (counter === 3) break;
    }
    return (
      <div className="home-page-wrap">
        <Helmet>
          <title>Resiroc | Home</title>
          <meta
            name="description"
            content="Resiroc is an online rental property management software that allows Landlords to organise and manage their rental properties more efficiently."
          />
        </Helmet>
        <Header
          featureRef={this.featureRef}
          priceRef={this.priceRef}
          blogRef={this.blogRef}
          contactRef={this.contactRef}
        />
        <section className="banner d-flex align-items-center">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="banner-holder text-white">
                  <h1>Effortlessly manage your Rental properties</h1>
                  <p className="mt-4 pt-1">Also available for mobile</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features py-5" id="feature" ref={this.featureRef}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="text-center py-5">Product Features</h2>
              </div>
            </div>
            <div className="row flex-wrap pt-5">
              <div className="col-sm-6 col-lg-4">
                <div className="col-holder text-center">
                  <div className="col-data">
                    <div className="icon-holder">
                      <img src={QuickSetup} alt="quick_setup icon" />
                    </div>
                    <div className="feature_desc">
                      <h3 className="my-3">Quick Setup</h3>
                      <p>
                        Quick set up allows you to start managing your
                        properties in no time
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4">
                <div className="col-holder text-center">
                  <div className="col-data">
                    <div className="icon-holder">
                      <img src={RentCollection} alt="rent_collection icon" />
                    </div>
                    <div className="feature_desc">
                      <h3 className="my-3">Rent Collection</h3>
                      <p>
                        Simple Direct debit set up to collect and manage Rent
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4">
                <div className="col-holder text-center">
                  <div className="col-data">
                    <div className="icon-holder">
                      <img src={InfoDashboard} alt="info_dashboard icon" />
                    </div>
                    <div className="feature_desc">
                      <h3 className="my-3">Informative Dashboard </h3>
                      <p>
                        Get an instant view of your rental portfolio performance
                        and early warnings of problems. Even see the effect of
                        increased interest rates on your return
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4">
                <div className="col-holder text-center">
                  <div className="col-data">
                    <div className="icon-holder">
                      <img src={ManageProperty} alt="manage_property icon" />
                    </div>
                    <div className="feature_desc">
                      <h3 className="my-3">Manage Property</h3>
                      <p>
                        Manage and assign property maintenance tasks to agents
                        and contractors
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4">
                <div className="col-holder text-center">
                  <div className="col-data">
                    <div className="icon-holder">
                      <img src={StartupServices} alt="startup_services icon" />
                    </div>
                    <div className="feature_desc">
                      <h3 className="my-3">Start up Services</h3>
                      <p>
                        We like to write interesting articles on policy changes
                        as well as informative and helpful pieces on issues
                        relating to property management.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4">
                <div className="col-holder text-center">
                  <div className="col-data">
                    <div className="icon-holder">
                      <img src={ManageDocuments} alt="manage_documents icon" />
                    </div>
                    <div className="feature_desc">
                      <h3 className="my-3">
                        Manage All Your Documents And Certificate
                      </h3>
                      <p>
                        Keep track of all documents (licences and certificates)
                        for each property including document expiry reminders"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="blogs py-5" ref={this.blogRef}>
          <div className="container">
            <div className="container">
              <div className="">
                <h6 className="font-extrabold text-center">Our Blog</h6>
                <p className="mt-5 text-center">
                  We like to write interesting articles on policy changes as
                  well as informative and helpful pieces on issues relating to
                  property management.
                </p>
              </div>
              <div className="row">{blogsMarkup}</div>
              <div className="w-full text-center mar-t-40">
                <Link className="bordered-btn" to="blogs">
                  View Our Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="pricing py-5" id="price" ref={this.priceRef}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2>Subscription Prices</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <h3 className="my-4">
                  One simple subscription starting at £10 a month which gives
                  you up to 5 active tenancies.
                  <br />
                  <br /> Additional active tenancies are charged at £0.80 per
                  tenancy per month
                </h3>
              </div>
              <div className="col-md-6">
                <div className="cost-holder">
                  <h4>Number of Tenancies</h4>
                  <div className="select-holder">
                    <div className="select-custom">
                      <input
                        type="number"
                        id="price-field"
                        onKeyDown={(e) => {
                          this.allowNumbersOnly(e);
                          this.calculation(e);
                        }}
                        min="0"
                        max="100"
                        onChange={(e) => {
                          this.calculation(e);
                        }}
                      />
                      {/* <div className="up-downbtn d-flex flex-column">
                        <button id="dropUp" className="up-btn">
                          <i className="fas fa-chevron-up"></i>
                        </button>
                        <button id="dropDown" className="down-btn">
                          <i className="fas fa-chevron-down"></i>
                        </button>
                      </div> */}
                    </div>
                  </div>
                  <p>
                    Will cost £
                    <span id="price-tenancy">{this.state?.result} </span>
                    per month
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <h4 className="mt-3">All the following are standard</h4>
                <ul className="pricing-features d-flex w-100 mt-4 row">
                  <div className="col-lg-4">
                    <li>
                      <i className="fas fa-check"></i>Rent and expense tracking
                    </li>
                    <li>
                      <i className="fas fa-check"></i>Direct Debit rent
                      collection
                    </li>
                  </div>
                  <div className="col-lg-4">
                    <li>
                      <i className="fas fa-check"></i>Tenant/landlord
                      notification
                    </li>
                    <li>
                      <i className="fas fa-check"></i>Tenant Access portal
                    </li>
                  </div>
                  <div className="col-lg-4">
                    <li>
                      <i className="fas fa-check"></i>Mortgage & loan management
                    </li>
                    <li>
                      <i className="fas fa-check"></i>Task Management
                    </li>
                  </div>
                </ul>
                <p className="limit-data">And there are no data limits</p>
              </div>
            </div>
          </div>
        </section>
        <section className="contact py-5" id="contact" ref={this.contactRef}>
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h2>Contact Us</h2>
                <p>Any Questions? Contact us!</p>
                {/* <h3
                  id="showMessage"
                  className="text-center text-success text-bold d-none"
                >
                  Your message has been sent successfully
                </h3> */}
              </div>
            </div>
            <div className="row flex-column-reverse flex-md-row">
              <div className="col-md-6">
                {/* <form onSubmit={this.contactUsHandler}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <span style={{ color: "red" }}>*</span>
                    <input
                      type="text*"
                      value={this.state.userName}
                      name="userName"
                      className="form-control"
                      id="name"
                      placeholder="Enter your name"
                      aria-describedby="emailHelp"
                      onChange={this.changeHandler}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailForm" className="form-label">
                      Email
                    </label>
                    <span style={{ color: "red" }}>*</span>
                    <input
                      type="email*"
                      value={this.state.email}
                      className="form-control"
                      id="emailForm"
                      name="email"
                      placeholder="Enter your email"
                      aria-describedby="emailHelp"
                      onChange={this.changeHandler}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <span style={{ color: "red" }}>*</span>
                    <input
                      type="tel"
                      className="form-control"
                      value={this.state.phoneNumber}
                      id="phone"
                      name="phoneNumber"
                      placeholder="Enter your phone number"
                      onChange={this.changeHandler}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <span style={{ color: "red" }}>*</span>
                    <textarea
                      rows="6"
                      className="form-control"
                      id="message"
                      placeholder="Enter your message here"
                      name="message"
                      onChange={this.changeHandler}
                      required
                    ></textarea>
                  </div>
                  <button
                    disabled={
                      !this.state.email ||
                      !this.state.userName ||
                      !this.state.phoneNumber
                    }
                    type="submit"
                    className="primary-button"
                    id="submitData"
                  >
                    Send
                  </button>
                </form> */}
                <div className="contact-info-wrapper">
                  <div className="contact-header">
                    <div className="logo-container">
                      <img src={logo} alt="Resiroc Logo" />
                    </div>
                    <h6>Our Office</h6>
                  </div>
                  <div className="address-container">
                    <p className="street-address">Regency House, Marlow, UK</p>
                    <a href="mailto:info@resiroc.net" className="mailto">
                      info@resiroc.net
                    </a>
                    <p className="phone">
                      Phone: <a href="tel:+4401628613764">01628613764</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 ">
                {/* <div className="contact-image-holder">
                  <img src={ContactImage} alt="Contact" />
                </div> */}

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2479.7206530392496!2d-0.7671766842797315!3d51.5733543796461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487689ddcc2b58bb%3A0x8a4b7cda315a6f38!2sDedmere%20Rd%2C%20Marlow%2C%20UK!5e0!3m2!1sen!2s!4v1665494805901!5m2!1sen!2s"
                  width="100%"
                  height="350"
                  style={{
                    border: 0,
                  }}
                  title="Map"
                  allowfullscreen="false"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default home;
