import React, { useState, useEffect, useRef } from "react";
import "./Statistics.css"; 

const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const requestRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const animate = (time) => {
      if (!startTimeRef.current) {
        startTimeRef.current = time;
      }
      const progress = (time - startTimeRef.current) / duration;
      const currentCount = Math.min(Math.floor(progress * end), end);

      if (currentCount <= end) {
        setCount(currentCount);
      }

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); 
      }
    };

    
    requestRef.current = requestAnimationFrame(animate);

    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [end, duration]); 

  return count;
};


function Statistics() {
  
  const activeStudentsTarget = 103;
  const activeStudentsCount = useCountUp(activeStudentsTarget, 2100); 

  const totalCoursesTarget = 10;
  const totalCoursesCount = useCountUp(totalCoursesTarget, 2200); 

  const instructorsTarget = 100;
  const instructorsCount = useCountUp(instructorsTarget, 2300); 

  const satisfactionRateTarget = 100;
  const satisfactionRate = useCountUp(satisfactionRateTarget, 2400); 

  return (
    <div className="addons-statistics-page-container">
      {/* Statistics Section */}
      <section className="statistics-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-number">
              {activeStudentsCount.toLocaleString()}
              {activeStudentsCount === activeStudentsTarget ? "k+" : ""}
            </h3>
            <p className="stat-label">Active Students</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">
              {totalCoursesCount.toLocaleString()}
              {totalCoursesCount === totalCoursesTarget ? "+" : ""}
            </h3>
            <p className="stat-label">Total Courses</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">
              {instructorsCount.toLocaleString()}
              {instructorsCount === instructorsTarget ? "+" : ""}
            </h3>
            <p className="stat-label">Instructors</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">
              {satisfactionRate.toLocaleString()}
              {satisfactionRate === satisfactionRateTarget ? "%+" : ""}
            </h3>
            <p className="stat-label">Satisfaction Rate</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Statistics;
