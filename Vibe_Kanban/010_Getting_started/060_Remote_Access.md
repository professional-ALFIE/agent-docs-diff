> 원본: https://vibekanban.com/docs/remote-access.md

> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Remote Access

> Access your local Vibe Kanban instance from another device

Remote Access allows you to access a host instance of Vibe Kanban from another device, like your mobile phone.

# 1. Launch Vibe Kanban on the host device

Make sure you've started Vibe Kanban and logged in.

# 2. Generate a pairing code

Open the settings dialog, navigate to the `Remote Access` tab and click `Show pairing code`:

<Frame>
  <img src="https://mintcdn.com/vibekanban/HLq7gw2cj-wAz1lt/images/remote-access-generate-pairing-code-settings.png?fit=max&auto=format&n=HLq7gw2cj-wAz1lt&q=85&s=8cc24a30143dedfc2caf19dc3b19a9b9" alt="Remote Access settings page on the host device with the Show pairing code button" width="2560" height="2048" data-path="images/remote-access-generate-pairing-code-settings.png" />
</Frame>

Make a note of the pairing code:

<Frame>
  <img src="https://mintcdn.com/vibekanban/HLq7gw2cj-wAz1lt/images/remote-access-generate-pairing-code-modal.png?fit=max&auto=format&n=HLq7gw2cj-wAz1lt&q=85&s=8ea34ac2a645719edd294961175d3b89" alt="Pairing code modal on the host device showing the generated code" width="2560" height="2048" data-path="images/remote-access-generate-pairing-code-modal.png" />
</Frame>

# 3. Log into Vibe Kanban cloud

On the client device where you'd now like to access your host machine from, navigate to [cloud.vibekanban.com](https://cloud.vibekanban.com) in a browser and log in.

# 4. Pair your client with your host

On your client, navigate to `Remote Access` and click `Link a host`. Select the relevant host from the dropdown:

<Frame>
  <img style={{maxHeight: "500px"}} src="https://mintcdn.com/vibekanban/HLq7gw2cj-wAz1lt/images/remote-access-pair-host-mobile-form.png?fit=max&auto=format&n=HLq7gw2cj-wAz1lt&q=85&s=ab80e9a88b6b8cacf7679c19410a0fb1" alt="Remote Access page on mobile showing the Pair host form with host selection and pairing code input" width="1170" height="2532" data-path="images/remote-access-pair-host-mobile-form.png" />
</Frame>

Enter the pairing code you generated earlier and click `Pair host`:

<Frame>
  <img style={{maxHeight: "500px"}} src="https://mintcdn.com/vibekanban/HLq7gw2cj-wAz1lt/images/remote-access-pair-host-mobile-select.png?fit=max&auto=format&n=HLq7gw2cj-wAz1lt&q=85&s=3369b326002abe66a8097caf9bcd1611" alt="Remote Access page on mobile with the host dropdown opened before pairing" width="1170" height="2532" data-path="images/remote-access-pair-host-mobile-select.png" />
</Frame>

# 5. Access workspaces from your host device

You can now exit the settings page. You should see the paired host, clicking on the host will list the host's workspaces.

<Frame>
  <img style={{maxHeight: "500px"}} src="https://mintcdn.com/vibekanban/6aVQAAybViVaue7Q/images/remote-access-cloud-mobile.png?fit=max&auto=format&n=6aVQAAybViVaue7Q&q=85&s=d7e3cf2fbd80d49374d554541e42c522" alt="Vibe Kanban cloud remote access page on mobile showing a paired host and workspaces" width="1170" height="2532" data-path="images/remote-access-cloud-mobile.png" />
</Frame>
