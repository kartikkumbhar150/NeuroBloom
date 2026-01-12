import requests
import uuid

def download_audio(url):
    filename = f"/tmp/{uuid.uuid4()}.wav"
    r = requests.get(url)
    with open(filename, "wb") as f:
        f.write(r.content)
    return filename
