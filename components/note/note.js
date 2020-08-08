import React, { useState } from 'react'
import { RiPushpin2Line, RiPushpinLine, RiDeleteBinLine } from 'react-icons/ri'
import ReactMarkdown from 'react-markdown/with-html'
import Badge from '../badge/badge'
import Button from '../button/button'
import { deleteNote } from '../../api/notesApi'
import Modal from '../modal/modal'
import { getAuthCookie } from '../../utils/cookie'
import { getFormattedDate } from '../../utils/dateParser'
import Loading from '../loading/loading'

function Note({ id, title, body, tags, createdAt, postDelete }) {
  const [pinned, setPinned] = useState(false)
  const [deletePrompt, setDeletePrompt] = useState(false)
  const [isDeleting, setDeleting] = useState(false)

  async function deleteHandler() {
    setDeleting(true)
    await deleteNote(getAuthCookie(), id)
    setDeleting(false)
    setDeletePrompt(false)
    postDelete()
  }
  return (
    <>
      {deletePrompt && (
        <Modal
          primaryButton={isDeleting ? <Loading color="white" /> : 'Yes'}
          secondaryButton="No"
          okHandler={deleteHandler}
          closeHandler={() => setDeletePrompt(false)}
        >
          <p>Are you sure?</p>
        </Modal>
      )}
      <div className="rounded p-3 my-2 shadow-small">
        <div className="flex flex-row justify-between">
          <h3 className="font-medium pb-2 w-8/12">{title}</h3>
          <div className="ml-1 w-4/12 text-right">
            <Button variant="transparent" className="p-2" onClick={() => setPinned(!pinned)}>
              {pinned ? <RiPushpinLine /> : <RiPushpin2Line />}
            </Button>
            <Button variant="transparent" className="p-2" onClick={() => setDeletePrompt(true)}>
              <RiDeleteBinLine />
            </Button>
          </div>
        </div>
        <div className="text-sm pb-3">
          <ReactMarkdown source={body} />
        </div>
        <div className="flex flex-row">
          <div className="w-9/12 rounded-full scrollbar-hidden flex scrolling-touch whitespace-no-wrap overflow-x-auto">
            {tags.map((tag) => (
              <Badge key={tag} text={tag} />
            ))}
          </div>
          <div className="w-3/12 text-xs text-right px-3 py-1 text-gray">
            {getFormattedDate(new Date(createdAt))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Note
