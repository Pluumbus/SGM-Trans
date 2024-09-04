import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const cellStyle = {
    padding: "6px",
    textAlign: "left",
    border: "1px solid #ccc",
    backgroundColor: "#f4f4f4",
  };
  return (
    <div>
      <table style={{ width: "60%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th className="p-6 text-left border-solid border-1 border-gray-600">
              Заголовок 1
            </th>
            <th className="p-6 text-left border-solid border-1 border-gray-600">
              Заголовок 2
            </th>
            <th className="p-6 text-left border-solid border-1 border-gray-600">
              Заголовок 3
            </th>
            <th className="p-6 text-left border-solid border-1 border-gray-600">
              Заголовок 4
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-6 text-left border-solid border-1 border-gray-600">
              Row 1, Cell 1
            </td>
            <td className="p-6 text-left border-solid border-1 border-gray-600">
              Row 1, Cell 2
            </td>
            <td className="p-6 text-left border-solid border-1 border-gray-600">
              Row 1, Cell 3
            </td>
            <td className="p-6 text-left border-solid border-1 border-gray-600">
              Row 1, Cell 4
            </td>
          </tr>
          <tr>
            <td className="p-6 text-left border-solid border-1 border-gray-600">
              Row 6, Cell 1
            </td>
            <td className="p-6 text-left border-solid border-1 border-gray-600">
              Row 6, Cell 2
            </td>
            <td className="p-6 text-left border-solid border-1 border-gray-600">
              Row 6, Cell 3
            </td>
            <td className="p-6 text-left border-solid border-1 border-gray-600">
              Row 6, Cell 4
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Page;
