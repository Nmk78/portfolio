## Data Envelope rule

```javascript
  // Success
  const responseEnvelope = {
      status: 'success',
      message: 'Graph data retrieved successfully',
      data: graphData,
    };

  // Error
     const errorResponseEnvelope = {
        status: 'error',
        error: error, // Debugging information
        message: "Unexpected error while sending graph data",  // Display error
        data: null,
    };
```

// FIXME: Change mongodb whitelist to backend ip

<!-- Projects -->
ERP
MOOZ
Plan Pilot
Selection
WYT