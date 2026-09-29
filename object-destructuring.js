const apiResponse = {
  status: 200,
  data: {
    user: {
      id: 42,
      username: "maxpower",
      email: "max@example.com",
      preferences: {
        theme: "dark",
        language: "de",
        notifications: true,
      },
    },
    meta: {
      requestId: "abc-123",
      timestamp: "2026-02-06T10:00:00Z",
    },
  },
};

// 1. username und email
{
  const { username, email } = apiResponse.data.user;
  console.log("1.", username, email);
}

// 2. theme und language (verschachtelt)
{
  const {
    data: {
      user: {
        preferences: { theme, language },
      },
    },
  } = apiResponse;
  console.log("2.", theme, language);
}

// 3. status und der gesamte Rest als payload
{
  const { status, ...payload } = apiResponse;
  console.log("3.", status, payload);
}

// 4. username beim Destructuring in name umbenennen
{
  const { username: name } = apiResponse.data.user;
  console.log("4.", name);
}
