function ContactUs() {
    return (
        <section id="contact" className="contact-section">
            <h2>Contact Us</h2>
            <form className="contact-form">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your name" />

                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Your email" />

                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="4" placeholder="How can we help?"></textarea>

                <button type="submit">Send Message</button>
            </form>
        </section>
    );
}

export default ContactUs;
