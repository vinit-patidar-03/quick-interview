"use client"
import context from "@/context/Context";
import React, { useContext } from "react";

const ProfilePage = () => {
  const { user } = useContext(context);
  return <div>{user?.username}</div>;
};

export default ProfilePage;
