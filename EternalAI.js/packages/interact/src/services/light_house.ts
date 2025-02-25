const LightHouse = {
  upload: async (content: string) => {
    console.log('LightHouse - Upload content to light house');
    const res = await fetch(
      'https://api.eternalai.org/api/service/light-house/upload/public',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      }
    );
    if (!res.ok) {
      throw new Error(`Light house upload failed: ${res.statusText}`);
    }

    const data = await res.json();
    console.log('LightHouse - Upload succeed - url', data.data);
    return data.data;
  },
};

export default LightHouse;
