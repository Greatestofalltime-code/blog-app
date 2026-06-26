function About() {
  const techs = [
    "HTML & CSS",
    "JavaScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "Flutter",
    "Git & GitHub",
    "REST APIs",
  ];

  return (
    <div className="about-page">
      <h1>
        About <span>Kanu</span>
      </h1>
      <p className="subtitle">
        IT Project Manager · PMP Certified · Software Engineer in Progress
      </p>

      <h2>Who I Am</h2>
      <p>
        I am a Senior IT Project Manager with over a decade of experience
        delivering telecoms infrastructure projects across Nigeria. In June 2026
        I passed my PMP certification — then immediately started a structured
        software engineering apprenticeship.
      </p>
      <p>
        This blog documents that journey — the concepts I am learning, the
        projects I am building, and the lessons that only come from actually
        shipping code.
      </p>

      <h2>Why Software Engineering</h2>
      <p>
        The best project managers in tech understand what they are managing.
        Not just timelines and budgets — the actual systems being built.
        Software engineering makes me a better PM and opens a parallel career
        track I am genuinely excited about.
      </p>

      <h2>What I Am Building With</h2>
      <div className="tech-grid">
        {techs.map((tech) => (
          <div key={tech} className="tech-item">
            {tech}
          </div>
        ))}
      </div>

      <h2>Get In Touch</h2>
      <p>
        Open to remote software engineering opportunities, freelance projects,
        and collaborations. Find me on GitHub and LinkedIn.
      </p>
    </div>
  );
}

export default About;