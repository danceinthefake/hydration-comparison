interface CardProps {
  title: string;
  description: string;
}

export default function Card({ title, description }: CardProps) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
