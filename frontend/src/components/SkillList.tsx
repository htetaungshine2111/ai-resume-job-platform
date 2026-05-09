type Props = {
  title: string;
  skills: string[];
};

function SkillList({ title, skills }: Props) {
  return (
    <div className="mb-3">
      <strong>{title}:</strong>

      <ul className="list-disc ml-6">
        {skills.map((skill, i) => (
          <li key={i}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}

export default SkillList;
