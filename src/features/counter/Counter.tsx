import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { increment, decrement, incrementByAmount, selectCount } from './counterSlice';

export default function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState('5');

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Redux Counter Demo
        </Typography>
        <Typography variant="h3" sx={{ textAlign: 'center', my: 2 }}>
          {count}
        </Typography>
        <Stack spacing={2} alignItems="center">
          <ButtonGroup variant="contained">
            <Button onClick={() => dispatch(decrement())} startIcon={<RemoveIcon />}>
              Decrement
            </Button>
            <Button onClick={() => dispatch(increment())} startIcon={<AddIcon />}>
              Increment
            </Button>
          </ButtonGroup>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ width: 100 }}
              label="Amount"
            />
            <Button
              variant="outlined"
              onClick={() => dispatch(incrementByAmount(Number(amount) || 0))}
            >
              Add Amount
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
