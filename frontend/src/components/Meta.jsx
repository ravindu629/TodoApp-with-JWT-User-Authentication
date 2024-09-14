import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome To TaskMate",
  description: "Organize your tasks efficiently and stay productive",
  keywords: "task management, to-do list, productivity, organize tasks",
};

export default Meta;
