import Link from "next/link";
import { PageContainer } from "@keystone-6/core/admin-ui/components";
import { Heading } from "@keystone-ui/core";

export default function Spotify() {
  return (
    <PageContainer header={<Heading type="h3">Spotify</Heading>}>
      <h1>This is a custom Admin UI Page</h1>
      <button>Login Spotify</button>
    </PageContainer>
  );
}
