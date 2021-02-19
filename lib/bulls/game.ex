defmodule Bulls.Game do
  # Create a new state
  def new do
    secret_len = 4
    %{
      secret: random_secret(secret_len),
      num_guesses: 8,
      secret_len: secret_len,
      guesses: [],
      results: [],
      won: false,
      lost: false,
    }
  end

  # Convert the state to the format to be sent to the frontend
  #  ie omit the secret
  def view(st) do
    %{
      guesses: st.guesses,
      results: st.results,
      won: st.won,
      lost: st.lost,
      num_guesses: st.num_guesses,
      secret_len: st.secret_len,
    }
  end

  # Make a guess
  def guess(st, guess) do
    at_max_guesses = length(st.guesses) === st.num_guesses
    if at_max_guesses do
      # disallow extra guesses from being made
      st
    else 
      # update the state accordingly
      won = guess === st.secret
      %{st |
        guesses: st.guesses ++ [guess],
        results: st.results ++ [result_of(guess, st.secret)],
        won: won,
        lost: !won and length(st.guesses) + 1 === st.num_guesses
      }
    end
  end

  # Determine the result of a guess
  def result_of(guess, secret) do
    secret_enum = String.split(secret, "", trim: true)

    # First determine the exact matches ("A" value)
    a_matches = secret_enum
    |> Enum.with_index
    |> Enum.filter(fn {x, i} -> String.at(guess, i) === x end)
    |> Enum.map(fn {x, _} -> x end)

    # Save the length of the matches enum
    a = a_matches
    |> length
    |> to_string

    # Determine the correct but wrong position digits ("B" value)
    #  by first removing digits we already counted
    b = secret_enum
    |> Enum.reject(fn x -> Enum.member?(a_matches, x) end)
    |> Enum.count(fn x -> String.contains?(guess, x) end)
    |> to_string

    #Return the string to denote the result
    "A" <> a <> "B" <> b
  end

  # Generate a random secret of length secret_len
  def random_secret(secret_len, secret \\ "") do
    cond do
      String.length(secret) === secret_len -> secret
      true ->
        digits = "1234567890"
        |> String.split("", trim: true)
        |> Enum.reject(fn x -> String.contains?(secret, x) end)

        random_secret(secret_len, secret <> Enum.random(digits))
    end
  end
end