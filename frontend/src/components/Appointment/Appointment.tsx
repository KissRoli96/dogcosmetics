import React, { useEffect, useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Box, Card, CardContent, Typography, Grid, FormControl, FormHelperText, Select, MenuItem, Button, Snackbar, TextField } from '@material-ui/core';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getServices } from '../../api/serviceApi';
import type { Service, Dog, Appointment } from '../../types/types';
import { AppointmentStatus} from '../../types/types';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { makeStyles } from '@mui/styles';
import { getDogs, getDog } from '../../api/dogApi';
import DogForm from '../DogForm/DogForm';
import { useNavigate } from 'react-router-dom';
import { createAppointment } from '../../api/appointmentApi';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles({
  legend: {
    // maxWidth: '200px'
  },
  available: {
    backgroundColor: 'green',
    color: 'white',
  },
  booked: {
    backgroundColor: 'red',
    color: 'white',
  },
  unavailable: {
    backgroundColor: 'gray',
    color: 'white',
  },
});

export default function Appointment() {
  const classes = useStyles();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [services, setServices] = useState<Service[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [dog, setDog] = useState<Dog | null>(null);
  const [payment, setPayment] = useState('');
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDogForm, setShowDogForm] = useState(false);
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const userId = '663219e5d704b104f3e11f7b'; 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [response, setResponse] = useState<Appointment | null>(null);

  const SuccessMessage = ({response}:{response: Appointment}) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h4" component="div" >
            Successful appointment
        </Typography>
        <Typography variant="body1" component="div">
  <strong>Service:</strong> {response.service}
</Typography>
<Typography variant="body1" component="div">
  Dog: {response.dog}
</Typography>
<Typography variant="body1" component="div">
  StartTime: {response.startTime}
</Typography>
<Typography variant="body1" component="div">
  EndTime: {response.endTime}
</Typography>
<Typography variant="body1" component="div">
  User: {response.user}
</Typography>
<Typography variant="body1" component="div">
  Status: {response.status}
</Typography>
<Typography variant="body1" component="div">
  Status: {response.notes}
</Typography>
<Typography variant="body1" component="div">
  Date: {response.date}
</Typography>
    </Box>
);
 
  useEffect(() => {
    const fetchServices = async () => {
      const data = await getServices();
      setServices(data);
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
      const data = await getDogs();
      const formattedData = data.map((dog: Dog) => ({
        ...dog,
        id: dog._id,
      }));
      setDogs(data);
    };
    fetchDogs();
  }, []);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        if (id) { // Check if id is not null
          const fetchedDog = await getDog(id);
          setDog(fetchedDog);
        }
      } catch (error) {
        if (error instanceof Error) { // Check if error is an instance of Error
          setError(`Failed to fetch dog: ${error.message}`);
        }
      }
    };

    fetchDog();
  }, [id]);


  const handleDateChange = (date: Dayjs | null) => {
    if (date && selectedService) {
      setDate(date);
      setEndTime(date.add(selectedService.duration, 'minute'));

     const startTime = date;
     setStartTime(startTime); 
    }

  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    setNotes(event.target.value);
  };

  const bookAppointment = async () => {

    const appointmentData = {
      service: selectedService?._id || '',
      date: Date(),
      dog: dog?._id || '',
      user: userId,
      status:  AppointmentStatus.Pending,
      notes: notes,
      startTime: startTime.format(), 
      endTime: endTime.format(),
    };
      const response = await createAppointment(appointmentData);
      setOpen(true);
      setOpenSnackbar(true);
      setIsSubmitted(true);


  if ('error' in response) {
    console.error(`Failed to book appointment: ${response.error}`);
  } else {
    setResponse(response);
    console.log('Appointment booked successfully:', response);
  }

  };


  //   const handleSnackbarClose = (event, reason) => {
  //     if (reason === 'clickaway') {
  //       return;
  //     }
  //     setOpen(false);
  //   };

  return (
    <>
    {isSubmitted && response ? (
      <SuccessMessage response={response} />
    ): (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5">Appointment Booking</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl>
                <Select
                  value={selectedService ? selectedService._id : ''}
                  onChange={(e) => setSelectedService(services.find(service => service._id === e.target.value) || null)}
                >
                  {services.map((service: Service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.name}
                      {service.duration && ` (${service.duration} minutes)`}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select a service</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} >
              <Typography variant="h6">
                <strong>Select Appointment Date and Time</strong>
              </Typography>
              <DateTimePicker
                value={date}
                onChange={handleDateChange}
                shouldDisableDate={(date) => date.isBefore(dayjs(), 'day')}

              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>End time:</strong> {endTime.format('dddd, MMMM D, YYYY [at] HH:mm')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
            <Typography variant="h6">
                <strong>Select Your Dog</strong>
              </Typography>
              <FormControl>
                <Select value={dog?._id} onChange={(e) => {
                  const selectedDog = dogs.find(dog => dog._id === e.target.value);
                  setDog(selectedDog || null);
                }}>
                  {dogs.filter(dog => dog.owner === '663219e5d704b104f3e11f7b').map((dog) => (
                    <MenuItem key={dog._id} value={dog._id}>{dog.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Select a dog or  
                  </FormHelperText>
                <Button variant="contained" color="secondary" onClick={() => navigate('/dog', { state: { userId } })}>Create new</Button>
              </FormControl>
              {showDogForm && <DogForm userId={userId} />}
            </Grid>
            <Grid item xs={12}>
    <Typography variant="h6">
      <strong>Notes</strong>
    </Typography>
    <FormControl>
      <TextField
        multiline
        value={notes}
        onChange={handleNotesChange}
      />
    </FormControl>
  </Grid>
            {/* <Grid item xs={12}> */}
              {/*<Typography variant="h6">
                <strong>Payment Method</strong>
               <FormControl>
                  <Select value={payment} onChange={(e) => setPayment(e.target.value)}>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="inPerson">In Person</MenuItem>
                  </Select>
                  <FormHelperText>Select a payment method</FormHelperText>
                </FormControl> */}
            {/* </Grid> */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" onClick ={bookAppointment} >Book</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
      )}
    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
    <Alert onClose={() => setOpenSnackbar(false)} severity="success">
        Form submitted successfully!
    </Alert>
</Snackbar>
    </>
  );
};