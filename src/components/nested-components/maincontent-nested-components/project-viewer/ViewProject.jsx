import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById } from "../../../../firebase";

export default function ViewProject() {
  const [project, setProject] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function getProject() {
      const data = await fetchProjectById(id);
      setProject(data);
    }
    getProject();
  }, [id]);

  return <div>{project ? <h1>{project.id}</h1> : <p>Loading...</p>}</div>;
}
