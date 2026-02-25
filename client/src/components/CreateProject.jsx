import { useState } from "react";
import axios from "axios";

function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/v1/projects",
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Project created");
      setName("");
      setDescription("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Create Project</button>
    </form>
  );
}

export default CreateProject;