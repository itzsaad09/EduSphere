import React from "react";
import "./AboutUs.css"; // CSS is now inlined

function AboutUs() {
  return (
    <>
      <div className="about-us-container">
        <header className="about-us-header">
          <h1 className="about-us-title">About Us</h1>
          <p className="about-us-subtitle">
            Discover Our Mission, Vision, and Values
          </p>
        </header>

        <section className="about-us-section vision-mission">
          <h2 className="section-title">Our Vision & Mission</h2>
          <div className="content-block">
            <p>
              Our **vision** is to create a world where education is accessible,
              engaging, and empowering for everyone, everywhere. We believe that
              knowledge is the key to unlocking potential, fostering innovation,
              and building a better future.
            </p>
            <p>
              Our **mission** is to provide high-quality, flexible, and
              interactive online learning experiences. We are dedicated to
              offering a diverse range of courses taught by expert instructors,
              designed to inspire curiosity and facilitate lifelong learning.
            </p>
          </div>
        </section>

        <section className="about-us-section values">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Accessibility</h3>
              <p>
                We strive to remove barriers to education, making learning
                affordable and available to all, regardless of location or
                background.
              </p>
            </div>
            <div className="value-card">
              <h3>Excellence</h3>
              <p>
                We are committed to delivering top-tier educational content and
                a seamless learning experience, continually seeking improvement
                and innovation.
              </p>
            </div>
            <div className="value-card">
              <h3>Community</h3>
              <p>
                We foster a supportive and collaborative environment where
                learners and instructors can connect, share ideas, and grow
                together.
              </p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>
                We embrace new technologies and teaching methodologies to keep
                our courses fresh, relevant, and at the forefront of online
                education.
              </p>
            </div>
          </div>
        </section>

        <section className="about-us-section team">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="content-block">
            <p>
              Behind EduSphere is a passionate team of educators, technologists,
              and creatives dedicated to transforming online learning. We
              believe in the power of shared knowledge and are constantly
              working to enhance your educational journey.
            </p>
            <p>
              Our instructors are leaders in their fields, bringing real-world
              expertise and a commitment to student success. Together, we're
              building a vibrant learning ecosystem.
            </p>
          </div>
        </section>

        <footer className="about-us-footer">
          <p>Join us on our journey to empower minds and build futures.</p>
          <button className="cta-button" onClick={() => window.location.href = '/courses'}>Explore Courses</button>
        </footer>
      </div>
    </>
  );
}

export default AboutUs;
