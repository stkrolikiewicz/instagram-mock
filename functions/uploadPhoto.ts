import { supabase } from './supabase'
import busboy from 'busboy'

type Fields = {
  owner_id: string,
  caption: string,
  image: {
      filename: string
      type: string
      content: Buffer
  }[]
}

function parseMultipartForm(event): Promise<Fields> {
  return new Promise((resolve) => {
    const fields = { owner_id: '', caption: '', image: [] }
    const bb = busboy({ headers: event.headers })
    bb.on('field', (fieldname, val) => {
      if(fieldname === 'ownerId') {
        fields.owner_id = val
      }
      if(fieldname === 'caption') {
        fields.caption = val
      }
    })
    bb.on('file', (name, file, info) => {
      const { filename, mimeType } = info

      file.on('data', (data) => {
        if (!fields[name]) fields[name] = []

        fields[name].push({
          filename,
          type: mimeType,
          content:  toArrayBuffer(data),
        })
      })
    })

    bb.on('close', () => {
      resolve(fields)
    })

    bb.end(Buffer.from(event.body, 'base64'))
  })
}
function toArrayBuffer(buffer) {
  const ab = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i]
  }
  return ab
}

exports.handler = async (event) => {
  try {
    let image, fileName, fields
    await parseMultipartForm(event)
      .then((res) => {
        fields = res
        image = fields.image[0].content
        fileName = Math.floor(Math.random() * 100000000000)
      },
      )
  
    if (image && fields) {
      const { data, error: uploadError } = await supabase.storage.from('images').upload('public/' + fileName, image, {
        contentType: 'image/png',
      })
    
      if (uploadError) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: uploadError,
            message: uploadError.message,
            data: null,
          }),
        }
      }
    
      const { error: insertError } = await supabase.from('posts').insert({
        url: data.path,
        caption: fields.caption,
        owner_id: parseInt(fields.owner_id),
      })
    
      if (insertError) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: insertError,
            message: insertError.message,
            data: null,
          }),
        }
      }
    
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            error: null,
            message: 'Image uploaded successfully!',
            data: {
              path: 'public/' + fileName,
            },
          },
        ),
      }
    } else {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: new Error('No image found'),
          message: 'No image found',
          data: null,
        }),
      }
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error,
        message: error.message,
        data: null,
      }),
    }
  }
}