import { Types } from "mongoose";

export const Task = {
  _id: "1",
  name: "Tarea de ejemplo",
  description: "Descripción de la tarea",
  project: "1",
  status: "pending",
  completedBy: [
    {
      user: "1",
      status: "completed",
    },
  ],
  notes: ["1"],
};

const Tasks = [
  {
    _id: "65f0c5e1a6e4b3d1f0a2b4c1",
    name: "Diseñar la interfaz de usuario",
    description: "Crear wireframes y prototipos para la nueva aplicación.",
    project: "65f0c7c5d8e4b3d1f0b4e701",
    status: "inProgress",
    completedBy: [
      {
        user: "65f0c8d9e4b3d1f0c5d6e702",
        status: "inProgress",
        _id: "65f0c9eae4b3d1f0d7e8f703",
      },
    ],
    notes: [
      "65f0ca1be4b3d1f0e9f0a704",
      "65f0ca2be4b3d1f0f1a2b705",
    ],
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-02T12:30:00Z",
    __v: 0,
  },
  {
    _id: "65f0ca3ce4b3d1f0f3b4c706",
    name: "Implementar autenticación",
    description: "Desarrollar el sistema de autenticación y autorización.",
    project: "65f0c7c5d8e4b3d1f0b4e701",
    status: "pending",
    completedBy: [],
    notes: [],
    createdAt: "2024-01-03T09:15:00Z",
    updatedAt: "2024-01-03T09:15:00Z",
    __v: 0,
  },
  {
    _id: "65f0ca4de4b3d1f0f5d6e807",
    name: "Escribir pruebas unitarias",
    description: "Crear pruebas unitarias para los módulos principales.",
    project: "65f0c7c5d8e4b3d1f0b4e701",
    status: "underReview",
    completedBy: [
      {
        user: "65f0c8d9e4b3d1f0c5d6e702",
        status: "underReview",
        _id: "65f0ca5ee4b3d1f0f7e8f908",
      },
    ],
    notes: ["65f0ca6fe4b3d1f0f9f0a99"],
    createdAt: "2024-01-04T14:20:00Z",
    updatedAt: "2024-01-05T16:45:00Z",
    __v: 0,
  },
  {
    _id: "65f0ca7ee4b3d1f0f1a2b101",
    name: "Optimizar la base de datos",
    description: "Revisar y optimizar las consultas a la base de datos.",
    project: "65f0c7c5d8e4b3d1f0b4e701",
    status: "completed",
    completedBy: [
      {
        user: "65f0c8d9e4b3d1f0c5d6e702",
        status: "completed",
        _id: "65f0ca8fe4b3d1f0f3b4c202",
      },
    ],
    notes: [],
    createdAt: "2024-01-06T08:00:00Z",
    updatedAt: "2024-01-07T10:10:00Z",
    __v: 0,
  },
  {
    _id: "65f0ca9ee4b3d1f0f5d6e303",
    name: "Revisar documentación",
    description: "Revisar y actualizar la documentación del proyecto.",
    project: "65f0c7c5d8e4b3d1f0b4e701",
    status: "onHold",
    completedBy: [],
    notes: [],
    createdAt: "2024-01-08T11:30:00Z",
    updatedAt: "2024-01-08T11:30:00Z",
    __v: 0,
  },
];

export default Tasks;
