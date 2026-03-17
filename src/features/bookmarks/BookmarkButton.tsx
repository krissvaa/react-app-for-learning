import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleBookmark } from './bookmarksSlice';
import type { RootState } from '../../app/store';

interface BookmarkButtonProps {
  resourceId: number;
}

export default function BookmarkButton({ resourceId }: BookmarkButtonProps) {
  const dispatch = useAppDispatch();
  const isBookmarked = useAppSelector((state: RootState) => state.bookmarks.ids.includes(resourceId));

  return (
    <Tooltip title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
      <IconButton onClick={() => dispatch(toggleBookmark(resourceId))} color={isBookmarked ? 'primary' : 'default'}>
        {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </IconButton>
    </Tooltip>
  );
}
