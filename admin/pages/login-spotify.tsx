import Link from "next/link";
import { PageContainer } from "@keystone-6/core/admin-ui/components";
import { Heading } from "@keystone-ui/core";
import axios from "axios";

export default function Spotify() {
  const handleLoginToSpotify = () => {
    axios.get(`/login`);
  };
  return (
    <PageContainer header={<Heading type="h3">Spotify</Heading>}>
      <h1>This is a custom Admin UI Page</h1>
      {/* <button onClick={handleLoginToSpotify}>Login Spotify</button> */}
      <a href="/login">Login Spotify</a>
    </PageContainer>
  );
}
