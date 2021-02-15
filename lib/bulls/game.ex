defmodule Bulls.Game do
  def new do
    %{
      secret: random_secret(),
      num_guesses: 8,
      secret_len: 4,
      guesses: [],
      results: [],
      won: false,
      lost: false,
    }
  end

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

  def guess(st, guess) do
    at_max_guesses = length(st.guesses) === st.num_guesses
    if at_max_guesses do
      st
    else 
      won = guess === st.secret
      %{st |
        guesses: st.guesses ++ [guess],
        results: st.results ++ [result_of(guess, st.secret)],
        won: won,
        lost: !won and length(st.guesses) + 1 === st.num_guesses
      }
    end
  end

  def result_of(guess, secret) do
    secret_enum = String.split(secret, "", trim: true)
    a_matches = secret_enum
    |> Enum.with_index
    |> Enum.filter(fn {x, i} -> String.at(guess, i) === x end)
    |> Enum.map(fn {x, _} -> x end)

    a = a_matches
    |> length
    |> to_string

    b = secret_enum
    |> Enum.reject(fn x -> Enum.member?(a_matches, x) end)
    |> Enum.count(fn x -> String.contains?(guess, x) end)
    |> to_string

    "A" <> a <> "B" <> b
  end

  def random_secret(secret \\ "") do
    cond do
      String.length(secret) === 4 -> secret
      true ->
        digits = "1234567890"
        |> String.split("", trim: true)
        |> Enum.reject(fn x -> String.contains?(secret, x) end)

        random_secret(secret <> Enum.random(digits))
    end
  end
end