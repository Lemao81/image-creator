# ImageCreator

A desktop app that turns a text description into an image file by calling a configurable image-generation API, letting the user iterate on the description until they accept a result.

## Language

### Creating images

**Prompt**:
The text description of the desired image, entered by the user.
_Avoid_: Query, description, input

**Generation**:
One request to the image API for a Prompt, yielding exactly one Candidate.
_Avoid_: Run, job, render

**Candidate**:
An image returned by a Generation that has not been saved; it remembers the Prompt it came from.
_Avoid_: Draft, preview, result

**Candidate history**:
The ordered Candidates of the current app session, browsable one at a time; held in memory only and lost when the app closes.
_Avoid_: Gallery, history, slider

### Saving images

**Accept**:
The act of choosing a Candidate and turning it into an Output file.
_Avoid_: Export, save, confirm

**Output file**:
The image file written to disk on Accept, having exactly the Output size and Output format.
_Avoid_: Export, result file

**Output size**:
The width and height in pixels the user requests for the Output file; independent of the size the API generates at.
_Avoid_: Resolution, dimensions, generation size

**Output format**:
The file type of the Output file: PNG, JPEG, WebP or ICO.
_Avoid_: Image type, extension

### Configuration

**Provider settings**:
The persisted connection details for the image API: base URL, API key and model.
_Avoid_: API config, credentials, connection
