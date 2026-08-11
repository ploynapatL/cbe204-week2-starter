function CourseCards({ courses }) {
    return (
        <div className="courses">
            {courses.map((course) => (
                <article className="course-card" key={course.title}>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <a href="#">Learn more</a>
                </article>
            ))}
        </div>
    );
}

export default CourseCards;
