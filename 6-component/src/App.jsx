import Navigation from './components/Navigation';
import CourseCards from './components/CourseCards';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';

const courses = [
    { title: 'Web Technology', description: 'Build modern web applications.' },
    { title: 'Cybersecurity', description: 'Protect systems and applications.' },
    { title: 'Database', description: 'Design and manage data systems.' },
    { title: 'Secure Coding', description: 'Write secure code in C.' },
    { title: 'Network Security', description: 'Secure networks and defend against attacks.' },
    { title: 'Digital Forensics', description: 'Investigate cyber incidents and preserve evidence.' },
];

function App() {
    return (
        <>
            <header className="hero">
                <Navigation />
                <div className="hero-content">
                    <h1>Cybersecurity Engineering Program</h1>
                    <p>Build secure systems, protect data, and prepare for a career in digital defense.</p>
                    <a className="btn" href="#contact">Apply Now</a>
                </div>
            </header>

            <main>
                <section id="about" className="program-info">
                    <h2>About the Program</h2>
                    <p>
                        This program equips students with practical skills in networking, secure coding,
                        ethical hacking, and risk management.
                    </p>
                </section>

                <section id="coursework" className="courses-section">
                    <h2>Coursework</h2>
                    <CourseCards courses={courses} />
                </section>

                <ContactUs />
            </main>

            <Footer />
        </>
    );
}

export default App;
