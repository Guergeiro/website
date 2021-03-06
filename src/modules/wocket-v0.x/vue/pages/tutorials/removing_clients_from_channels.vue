<script>
import H2Hash from "/assets/common/vue/h2_hash.vue";
import Page from "/assets/common/vue/page.vue";
import CodeBlock from "/assets/common/vue/code_block.vue";
import FolderStructureEndState from "/assets/common/vue/folder_structure_end_state.vue"

const title = "Removing Clients From Channels";

export const resource = {
  paths: [
    "/tutorials/removing-clients-from-channels",
  ],
  meta: {
    title: title
  }
}

export default {
  components: {
    CodeBlock,
    H2Hash,
    Page,
    FolderStructureEndState
  },
  data() {
    return {
      base_url: this.$conf.wocket.base_url + "/#",
      title: title,
      toc: [
        "Before You Get Started",
        "Folder Structure End State",
        "Steps",
        "Verification",
      ],
    };
  }
}
</script>

<template lang="pug">
page(
  :base_url="base_url"
  :title="title"
  :toc="toc"
)
  h2-hash Before You Get Started
  p Removing clients from channels can be done using the following call:
  code-block(:header="false" language="typescript")
    | server.removeClientFromChannel("Channel Name", clientId);
  p In this tutorial, you will:
  ul
    li create a server;
    li open two client connections; and
    li have one client call the server to tell it to remove the other client from a channel.
  hr
  folder-structure-end-state
    code-block(:header="false" language="text" :line_numbers="false")
      | ▾ /path/to/your/project/
      |     app.ts
  hr
  h2-hash Steps
  ol
    li
      p Create your server.
      code-block(title="/path/to/your/project/app.ts" language="typescript")
        | import { Packet, Server } from "https://deno.land/x/wocket@{{ $conf.wocket.latest_version }}/mod.ts";
        |
        | // Create the server
        | const server = new Server();
        |
        | // Run the server
        | server.run({
        |   hostname: "127.0.0.1",
        |   port: 1777,
        | });
        |
        | console.log(
        |   `Server started on ws://${server.hostname}:${server.port}`,
        | );
        |
    li
      p Add a packet handler to the Actions channel (see the highlighted code).
      code-block(title="/path/to/your/project/app.ts" language="typescript" line_highlight="21-40")
        | import { Packet, Server } from "https://deno.land/x/wocket@{{ $conf.wocket.latest_version }}/mod.ts";
        |
        | // Create the server
        | const server = new Server();
        | server.run({
        |   hostname: "127.0.0.1",
        |   port: 1777,
        | });
        |
        | console.log(
        |   `Server started on ws://${server.hostname}:${server.port}`,
        | );
        |
        | // Open the "Channel 1" channel
        | server.on("Channel 1", (packet: Packet) => {})
        |
        | // Open the "Actions" channel and add a handler for packets sent to the Actions channel. This handler will be
        | // executed every time a packet is sent to the Actions channel. In this
        | // handler, we are parsing the message and taking an action based on the
        | // specified message.
        | server.on("Actions", (packet: Packet) => {
        |   const message = packet.message as {[k: string]: string};
        |   if (message.action && message.channel) {
        |     try {
        |       if (message.action == "remove_client_from_channel") {
        |         server.removeClientFromChannel(message.channel, parseInt(message.client_id));
        |         server.to(
        |           "Actions",
        |           `Client #${message.client_id} was removed from the ${message.channel} channel.`
        |         );
        |       }
        |     } catch (error) {
        |       console.log(error);
        |     }
        |   }
        | });
  hr
  h2-hash Verification
  ol
    li
      p Run your server.
      code-block(title="Terminal" language="shell-session")
        | $ deno run --allow-net app.ts
    li
      p Connect the first client to your server.
      code-block(title="Terminal" language="shell-session")
        | $ wscat -c ws://127.0.0.1:1777
    li
      p Connect the second client to your server and get its ID.
      code-block(title="Terminal" language="shell-session")
        | $ wscat -c ws://127.0.0.1:1777
      code-block(title="Terminal" language="shell-session")
        | > id
      p You should receive a response similar to the following:
      code-block(title="Terminal" language="shell-session")
        | < Client ID: 5
    li
      p Using the second client, connect to Channel 1.
      code-block(title="Terminal" language="shell-session")
        | > {"connect_to":["Channel 1"]}
      p You should receive the following response:
      code-block(title="Terminal" language="shell-session")
        | < Connected to Channel 1.
    li
      p Using the first client, connect to the Actions channel.
      code-block(title="Terminal" language="shell-session")
        | > {"connect_to":["Actions"]}
      p You should receive the following response:
      code-block(title="Terminal" language="shell-session")
        | > Connected to Actions.
    li
      p Using the first client, send a packet to the Actions channel to remove the second client from Channel 1. Make sure you use the correct client ID!
      code-block(title="Terminal" language="shell-session")
        | > {"send_packet":{"to":"Actions","message":{"action":"remove_client_from_channel","client_id":"5","channel":"Channel 1"}}}
      p You should receive a response similar to the following:
      code-block(:header="false" language="shell-session")
        | < {"from":"Server","to":"Actions","message":"Client #5 was removed from the Channel 1 channel."}
    li
      p Using the second client, disconnect from Channel 1.
      code-block(title="Terminal" language="shell-session")
        | > {"disconnect_from":["Channel 1"]}
      p If the second client was removed, you should receive the following response:
      code-block(:header="false" language="shell-session")
        | < Not connected to Channel 1.
</template>

